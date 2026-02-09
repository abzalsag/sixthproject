package com.example.sixthproject.service;

import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

@Service
public class FileStorageService {

    @Autowired
    private MinioClient minioClient;

    @Value("${minio.bucket-name}")
    private String bucketName;

    public String uploadFile(MultipartFile file) {
        try {
            // Файл аты қайталанбас үшін алдына уақытты қосамыз
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();

            // Файлды оқу
            InputStream inputStream = file.getInputStream();

            // MinIO-ға жіберу
            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(bucketName)
                            .object(fileName)
                            .stream(inputStream, file.getSize(), -1)
                            .contentType(file.getContentType())
                            .build()
            );

            return "Файл сәтті жүктелді: " + fileName;

        } catch (Exception e) {
            e.printStackTrace();
            return "Қате шықты: " + e.getMessage();
        }
    }
}