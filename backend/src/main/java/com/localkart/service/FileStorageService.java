package com.localkart.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class FileStorageService {

    private final String uploadDir = "uploads/";

    public String storeProductImage(MultipartFile file) throws IOException {
        // 1. Create directory if it doesn't exist
        Path path = Paths.get(uploadDir);
        if (!Files.exists(path)) {
            Files.createDirectories(path);
        }

        // 2. Generate unique name to prevent overwriting
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
        
        // 3. Save file to disk
        Path filePath = path.resolve(fileName);
        Files.copy(file.getInputStream(), filePath);

        return fileName;
    }
}