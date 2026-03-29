package org.example.toi.service.impl;

import io.minio.GetObjectArgs;
import io.minio.GetObjectResponse;
import io.minio.ListObjectsArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.StatObjectArgs;
import io.minio.StatObjectResponse;
import io.minio.messages.Item;
import io.minio.Result;
import java.io.IOException;
import java.io.InputStream;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.example.toi.common.exception.BadRequestException;
import org.example.toi.common.exception.NotFoundException;
import org.example.toi.entity.User;
import org.example.toi.repository.UserRepository;
import org.example.toi.service.MediaStorageService;
import org.example.toi.dto.response.UploadFileResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class MinioMediaStorageService implements MediaStorageService {

    private final MinioClient minioClient;
    private final UserRepository userRepository;

    @Value("${minio.bucket:uploads}")
    private String bucket;

    @Value("${minio.public-url:}")
    private String publicUrl;

    @Value("${minio.presign-expiration-seconds:86400}")
    private long presignSeconds;

    /** Базовый URL бэкенда для proxy-endpoint-а. */
    @Value("${uploads.public-url:http://localhost:9191}")
    private String backendPublicUrl;

    @Override
    public UploadFileResponse uploadImage(MultipartFile file, String category) throws IOException {
        validateFile(file, "image/");
        return store(file, "images", category);
    }

    @Override
    public UploadFileResponse uploadAudio(MultipartFile file, String category) throws IOException {
        validateFile(file, "audio/");
        return store(file, "audio", category);
    }

    @Override
    public List<UploadFileResponse> listUploads(String type, String category) throws IOException {
        String subfolder = resolveSubfolder(type);
        String userId = currentUser().getId().toString();
        String keyPrefix = buildKeyPrefix(userId, category, subfolder);

        Iterable<Result<Item>> results = minioClient.listObjects(
                ListObjectsArgs.builder()
                        .bucket(bucket)
                        .prefix(keyPrefix)
                        .recursive(true)
                        .build()
        );

        List<UploadFileResponse> list = new ArrayList<>();
        for (Result<Item> res : results) {
            try {
                Item item = res.get();
                String objectName = item.objectName();
                if (objectName.endsWith("/")) continue; // skip folders
                String url = buildPublicUrl(objectName);
                list.add(UploadFileResponse.builder()
                        .url(url)
                        .path("/" + bucket + "/" + objectName)
                        .build());
            } catch (Exception e) {
                throw new IOException("Failed to list objects", e);
            }
        }
        return list;
    }

    /* helpers */

    private UploadFileResponse store(MultipartFile file, String subfolder, String category) throws IOException {
        String userId = currentUser().getId().toString();
        String original = StringUtils.cleanPath(file.getOriginalFilename() == null ? "" : file.getOriginalFilename());
        String ext = "";
        int dot = original.lastIndexOf('.');
        if (dot >= 0 && dot < original.length() - 1) {
            ext = original.substring(dot);
        }
        String filename = Instant.now().getEpochSecond() + "-" + UUID.randomUUID() + ext;
        String objectName = buildKeyPrefix(userId, category, subfolder) + filename;

        try (InputStream is = file.getInputStream()) {
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucket)
                            .object(objectName)
                            .stream(is, file.getSize(), -1)
                            .contentType(file.getContentType() != null ? file.getContentType() : MediaType.APPLICATION_OCTET_STREAM_VALUE)
                            .build()
            );
        } catch (Exception e) {
            throw new IOException("Failed to upload to MinIO", e);
        }

        String url = buildPublicUrl(objectName);
        return UploadFileResponse.builder()
                .url(url)
                .path("/" + bucket + "/" + objectName)
                .build();
    }

    private String buildKeyPrefix(String userId, String category, String subfolder) {
        String safeCategory = safeCategory(category);
        StringBuilder sb = new StringBuilder();
        sb.append(userId).append("/");
        if (safeCategory != null) {
            sb.append(safeCategory).append("/");
        }
        sb.append(subfolder).append("/");
        return sb.toString();
    }

    /**
     * Возвращает URL через proxy-endpoint бэкенда.
     * Так файлы всегда доступны через один порт (7171), без прямого доступа к MinIO.
     */
    private String buildPublicUrl(String objectName) {
        // Если явно задан minio.public-url — используем его (например, CDN или MinIO с public bucket)
        if (publicUrl != null && !publicUrl.isBlank()) {
            return publicUrl.replaceAll("/+$", "") + "/" + objectName;
        }
        // Иначе — через proxy-endpoint бэкенда: GET /api/v1/uploads/file/{objectName}
        String base = backendPublicUrl.replaceAll("/+$", "");
        return base + "/api/v1/uploads/file/" + objectName;
    }

    @Override
    public InputStream streamFile(String objectName) throws IOException {
        try {
            GetObjectResponse response = minioClient.getObject(
                    GetObjectArgs.builder()
                            .bucket(bucket)
                            .object(objectName)
                            .build()
            );
            return response;
        } catch (Exception e) {
            throw new IOException("Failed to stream file from MinIO: " + objectName, e);
        }
    }

    @Override
    public String getContentType(String objectName) throws IOException {
        try {
            StatObjectResponse stat = minioClient.statObject(
                    StatObjectArgs.builder()
                            .bucket(bucket)
                            .object(objectName)
                            .build()
            );
            return stat.contentType();
        } catch (Exception e) {
            // Fallback по расширению
            if (objectName.matches(".*\\.(jpg|jpeg)$")) return "image/jpeg";
            if (objectName.endsWith(".png"))  return "image/png";
            if (objectName.endsWith(".webp")) return "image/webp";
            if (objectName.endsWith(".gif"))  return "image/gif";
            if (objectName.endsWith(".mp3"))  return "audio/mpeg";
            if (objectName.endsWith(".ogg"))  return "audio/ogg";
            return "application/octet-stream";
        }
    }

    private void validateFile(MultipartFile file, String requiredPrefix) {
        if (file.isEmpty()) {
            throw new BadRequestException("Файл бос");
        }
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith(requiredPrefix)) {
            throw new BadRequestException(requiredPrefix.startsWith("image") ? "Тек сурет файлы қажет" : "Тек аудио файлды жүктеңіз");
        }
    }

    private String safeCategory(String category) {
        if (category == null || category.isBlank()) return null;
        return category.replaceAll("[^a-zA-Z0-9_-]", "");
    }

    private String resolveSubfolder(String type) {
        if ("audio".equalsIgnoreCase(type)) return "audio";
        if ("image".equalsIgnoreCase(type) || "images".equalsIgnoreCase(type)) return "images";
        throw new BadRequestException("type must be image|audio");
    }

    private User currentUser() {
        String phone = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByPhoneAndIsDeletedFalse(phone).orElseThrow(() -> new NotFoundException("User not found"));
    }
}
