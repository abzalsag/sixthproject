package com.example.sixthproject.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

/**
 * FileService — MinIO орнына жергілікті дискіге сақтайды.
 * UserService аватар жүктеу үшін қолданады.
 */
@Service
public class FileService {

    @Value("${app.upload-dir:uploads}")
    private String uploadDir;

    public String uploadFile(MultipartFile file) {
        try {
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);

            String fileName = UUID.randomUUID() + "_" + sanitize(file.getOriginalFilename());
            Path targetPath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            // URL қайтарамыз — /api/uploads/ арқылы қолжетімді
            return "/api/uploads/" + fileName;

        } catch (IOException e) {
            throw new RuntimeException("Файлды сақтау мүмкін болмады: " + e.getMessage(), e);
        }
    }

    public InputStream getFile(String fileName) {
        try {
            // fileName "/api/uploads/xxx" немесе тек "xxx" болуы мүмкін
            String name = fileName.startsWith("/api/uploads/")
                    ? fileName.substring("/api/uploads/".length())
                    : fileName;
            Path filePath = Paths.get(uploadDir).toAbsolutePath().normalize().resolve(name);
            return new FileInputStream(filePath.toFile());
        } catch (IOException e) {
            throw new RuntimeException("Файлды оқу мүмкін болмады: " + e.getMessage(), e);
        }
    }

    private String sanitize(String filename) {
        if (filename == null) return "file";
        return filename.replaceAll("[^a-zA-Z0-9._-]", "_");
    }
}