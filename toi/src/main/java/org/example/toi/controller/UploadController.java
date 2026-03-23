package org.example.toi.controller;

import java.io.IOException;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.example.toi.service.MediaStorageService;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.example.toi.dto.response.UploadFileResponse;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/v1/uploads")
@RequiredArgsConstructor
public class UploadController {

    private final MediaStorageService mediaStorageService;

    @PostMapping(path = "/image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UploadFileResponse> uploadImage(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "category", required = false) String category
    ) throws IOException {
        return ResponseEntity.ok(mediaStorageService.uploadImage(file, category));
    }

    @PostMapping(path = "/audio", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<UploadFileResponse> uploadAudio(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "category", required = false) String category
    ) throws IOException {
        return ResponseEntity.ok(mediaStorageService.uploadAudio(file, category));
    }

    @GetMapping("/list")
    public ResponseEntity<List<UploadFileResponse>> listUploads(
            @RequestParam("type") String type,
            @RequestParam(value = "category", required = false) String category
    ) throws IOException {
        return ResponseEntity.ok(mediaStorageService.listUploads(type, category));
    }
}
