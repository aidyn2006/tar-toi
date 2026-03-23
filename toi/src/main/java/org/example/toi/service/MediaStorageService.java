package org.example.toi.service;

import java.io.IOException;
import java.util.List;
import org.example.toi.dto.response.UploadFileResponse;
import org.springframework.web.multipart.MultipartFile;

public interface MediaStorageService {
    UploadFileResponse uploadImage(MultipartFile file, String category) throws IOException;
    UploadFileResponse uploadAudio(MultipartFile file, String category) throws IOException;
    List<UploadFileResponse> listUploads(String type, String category) throws IOException;
}
