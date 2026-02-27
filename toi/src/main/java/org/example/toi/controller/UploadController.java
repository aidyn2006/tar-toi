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
        String url = storeFile(file, "images");
        return ResponseEntity.ok(Map.of("url", url));
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
        String url = storeFile(file, "audio");
        return ResponseEntity.ok(Map.of("url", url));
    }

    private String storeFile(MultipartFile file, String subfolder) throws IOException {
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
        return "/uploads/" + subfolder + "/" + filename;
    }
}
