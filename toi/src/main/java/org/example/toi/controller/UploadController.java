package org.example.toi.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/uploads")
@RequiredArgsConstructor
public class UploadController {

    @Value("${uploads.dir:uploads}")
    private String uploadDir;
    @Value("${uploads.public-url:}")
    private String publicUrl;

    private Path ensureDir(String sub) throws IOException {
        Path dir = Paths.get(uploadDir, sub).toAbsolutePath().normalize();
        Files.createDirectories(dir);
        return dir;
    }

    @PostMapping(path = "/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> uploadImage(@RequestParam("file") MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Файл бос"));
        }
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            return ResponseEntity.badRequest().body(Map.of("error", "Тек сурет файлы қажет"));
        }
        return ResponseEntity.ok(storeFile(file, "images"));
    }

    @PostMapping(path = "/audio", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> uploadAudio(@RequestParam("file") MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Файл бос"));
        }
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("audio/")) {
            return ResponseEntity.badRequest().body(Map.of("error", "Тек аудио файлды жүктеңіз"));
        }
        return ResponseEntity.ok(storeFile(file, "audio"));
    }

    private Map<String, String> storeFile(MultipartFile file, String subfolder) throws IOException {
        String original = StringUtils.cleanPath(file.getOriginalFilename() == null ? "" : file.getOriginalFilename());
        String ext = "";
        int dot = original.lastIndexOf('.');
        if (dot >= 0 && dot < original.length() - 1) {
            ext = original.substring(dot);
        }
        String filename = Instant.now().getEpochSecond() + "-" + UUID.randomUUID() + ext;
        Path dir = ensureDir(subfolder);
        Path target = dir.resolve(filename);
        file.transferTo(target);
        String relative = "/uploads/" + subfolder + "/" + filename;
        String base = publicUrl != null && !publicUrl.isBlank()
                ? publicUrl.replaceAll("/+$", "")
                : ServletUriComponentsBuilder.fromCurrentContextPath().build().toUriString();
        if (base.endsWith("/")) base = base.substring(0, base.length() - 1);
        String absolute = base + relative;
        return Map.of(
                "url", absolute,
                "path", relative
        );
    }
}
