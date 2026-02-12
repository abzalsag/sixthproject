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

        String fileName = fileService.uploadFile(file);


        User user = repository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));


        user.setAvatarUrl(fileName);
        repository.save(user);
    }

    public InputStream getAvatarStream(String filename) {
        return fileService.getFile(filename);
    }

    public void updateUser(User currentUser, UpdateUserRequest request) {

        if (request.getFirstname() != null && !request.getFirstname().isEmpty()) {
            currentUser.setFirstname(request.getFirstname());
        }


        if (request.getLastname() != null && !request.getLastname().isEmpty()) {
            currentUser.setLastname(request.getLastname());
        }


        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            currentUser.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        repository.save(currentUser);
    }
}