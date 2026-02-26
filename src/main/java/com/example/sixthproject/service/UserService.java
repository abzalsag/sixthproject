package com.example.sixthproject.service;

import com.example.sixthproject.dto.UpdateUserRequest;
import com.example.sixthproject.entity.User;
import com.example.sixthproject.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.time.LocalDateTime;

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






        if (request.getFirstname() != null) currentUser.setFirstname(request.getFirstname());
        if (request.getLastname() != null) currentUser.setLastname(request.getLastname());
        if (request.getPassword() != null) currentUser.setPassword(passwordEncoder.encode(request.getPassword()));
        if (request.getCity() != null) currentUser.setCity(request.getCity());
        if (request.getBio() != null) currentUser.setBio(request.getBio());
        if (request.getIsPrivate() != null) currentUser.setPrivate(request.getIsPrivate());
        if (request.getShowOnlineStatus() != null) currentUser.setShowOnlineStatus(request.getShowOnlineStatus());
        if (request.getPushNotifications() != null) currentUser.setPushNotifications(request.getPushNotifications());
        if (request.getEmailNotifications() != null) currentUser.setEmailNotifications(request.getEmailNotifications());
        if (request.getInterests() != null) currentUser.setInterests(request.getInterests());

        
        repository.save(currentUser);
    }
}