package com.example.sixthproject.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

/**
 * LocalFileStorageService — MinIO орнына жергілікті дискіге сақтайды.
 * Файлдар ./uploads/ қалтасына жазылады.
 * URL: /api/uploads/{filename} арқылы қолжетімді.
 */
@Service
public class FileStorageService {

    @Value("${app.upload-dir:uploads}")
    private String uploadDir;

    /**
     * Файлды дискіге сақтап, URL қайтарады.
     */
    public String uploadFile(MultipartFile file) {
        try {
            // Қалтаны жасау (жоқ болса)
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);

            // Бірегей файл атауы
            String fileName = System.currentTimeMillis() + "_" + sanitize(file.getOriginalFilename());
            Path targetPath = uploadPath.resolve(fileName);

            // Файлды көшіру
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            // Frontend-ке берілетін URL (Vite proxy арқылы /api/uploads/{name})
            return "/api/uploads/" + fileName;

        } catch (IOException e) {
            throw new RuntimeException("Файлды сақтау мүмкін болмады: " + e.getMessage(), e);
        }
    }

    /**
     * Файл атауын тазалаймыз (path traversal қаупінен сақтаймыз)
     */
    private String sanitize(String filename) {
        if (filename == null) return "file";
        return filename.replaceAll("[^a-zA-Z0-9._-]", "_");
    }
}