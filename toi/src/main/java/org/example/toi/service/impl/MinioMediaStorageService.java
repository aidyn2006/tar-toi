package org.example.toi.service.impl;

import io.minio.GetPresignedObjectUrlArgs;
import io.minio.ListObjectsArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.http.Method;
import io.minio.messages.Item;
import io.minio.Result;
import java.io.IOException;
import java.io.InputStream;
import java.time.Duration;
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

    private String buildPublicUrl(String objectName) throws IOException {
        if (publicUrl != null && !publicUrl.isBlank()) {
            return publicUrl.replaceAll("/+$", "") + "/" + objectName;
        }
        try {
            return minioClient.getPresignedObjectUrl(
                    GetPresignedObjectUrlArgs.builder()
                            .method(Method.GET)
                            .bucket(bucket)
                            .object(objectName)
                            .expiry((int) Math.min(presignSeconds, Duration.ofDays(7).getSeconds()))
                            .build()
            );
        } catch (Exception e) {
            throw new IOException("Failed to generate presigned url", e);
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
