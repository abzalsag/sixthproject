package com.example.sixthproject.service;

import com.example.sixthproject.dto.UpdateUserRequest;
import com.example.sixthproject.entity.User;
import com.example.sixthproject.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final FileService fileService;

    public void uploadAvatar(String username, MultipartFile file) {
        // 1. MinIO-ға файлды саламыз
        String fileName = fileService.uploadFile(file);

        // 2. User-ді табамыз
        User user = repository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 3. Аватар атын базаға жазамыз
        user.setAvatarUrl(fileName);
        repository.save(user);
    }

    public InputStream getAvatarStream(String filename) {
        return fileService.getFile(filename);
    }

    public void updateUser(User currentUser, UpdateUserRequest request) {
        // 1. Атын өзгерту (егер бос болмаса)
        if (request.getFirstname() != null && !request.getFirstname().isEmpty()) {
            currentUser.setFirstname(request.getFirstname());
        }

        // 2. Тегін өзгерту
        if (request.getLastname() != null && !request.getLastname().isEmpty()) {
            currentUser.setLastname(request.getLastname());
        }

        // 3. Пароль өзгерту (егер толтырса ғана)
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            currentUser.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        // 4. Сақтау
        repository.save(currentUser);
    }
}