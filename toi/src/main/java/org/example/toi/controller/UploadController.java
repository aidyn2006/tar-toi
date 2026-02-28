package org.example.toi.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
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
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

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
    public ResponseEntity<Map<String, String>> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "category", required = false) String category
    ) throws IOException {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Файл бос"));
        }
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            return ResponseEntity.badRequest().body(Map.of("error", "Тек сурет файлы қажет"));
        }
        return ResponseEntity.ok(storeFile(file, "images", category));
    }

    @PostMapping(path = "/audio", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> uploadAudio(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "category", required = false) String category
    ) throws IOException {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Файл бос"));
        }
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("audio/")) {
            return ResponseEntity.badRequest().body(Map.of("error", "Тек аудио файлды жүктеңіз"));
        }
        return ResponseEntity.ok(storeFile(file, "audio", category));
    }

    @GetMapping("/list")
    public ResponseEntity<List<Map<String, String>>> listUploads(
            @RequestParam("type") String type,
            @RequestParam(value = "category", required = false) String category
    ) throws IOException {
        String subfolder;
        if ("audio".equalsIgnoreCase(type)) {
            subfolder = "audio";
        } else if ("image".equalsIgnoreCase(type) || "images".equalsIgnoreCase(type)) {
            subfolder = "images";
        } else {
            return ResponseEntity.badRequest().body(List.of(Map.of("error", "type must be image|audio")));
        }

        String categorySafe = (category == null || category.isBlank()) ? null : category.replaceAll("[^a-zA-Z0-9_-]", "");
        Path dir = categorySafe == null ? ensureDir(subfolder) : ensureDir(categorySafe + "/" + subfolder);

        try (Stream<Path> stream = Files.list(dir)) {
            List<Map<String, String>> files = stream
                    .filter(Files::isRegularFile)
                    .sorted((a, b) -> b.getFileName().toString().compareToIgnoreCase(a.getFileName().toString()))
                    .map(p -> {
                        String relative = "/uploads/" + (categorySafe == null ? "" : categorySafe + "/") + subfolder + "/" + p.getFileName();
                        return Map.of(
                                "url", buildPublicUrl(relative),
                                "path", relative
                        );
                    })
                    .collect(Collectors.toList());
            return ResponseEntity.ok(files);
        }
    }

    private Map<String, String> storeFile(MultipartFile file, String subfolder, String category) throws IOException {
        String original = StringUtils.cleanPath(file.getOriginalFilename() == null ? "" : file.getOriginalFilename());
        String ext = "";
        int dot = original.lastIndexOf('.');
        if (dot >= 0 && dot < original.length() - 1) {
            ext = original.substring(dot);
        }
        String filename = Instant.now().getEpochSecond() + "-" + UUID.randomUUID() + ext;
        String categorySafe = (category == null || category.isBlank()) ? null : category.replaceAll("[^a-zA-Z0-9_-]", "");
        Path dir = categorySafe == null ? ensureDir(subfolder) : ensureDir(categorySafe + "/" + subfolder);
        Path target = dir.resolve(filename);
        file.transferTo(target);
        String relative = "/uploads/" + (categorySafe == null ? "" : categorySafe + "/") + subfolder + "/" + filename;
        return Map.of(
                "url", buildPublicUrl(relative),
                "path", relative
        );
    }

    private String buildPublicUrl(String relative) {
        String base = publicUrl != null && !publicUrl.isBlank()
                ? publicUrl.replaceAll("/+$", "")
                : ServletUriComponentsBuilder.fromCurrentContextPath().build().toUriString();
        if (base.endsWith("/")) base = base.substring(0, base.length() - 1);
        return base + relative;
    }
}
