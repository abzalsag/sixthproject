package com.example.sixthproject.controller;

import com.example.sixthproject.dto.UpdateUserRequest;
import com.example.sixthproject.entity.User;
import com.example.sixthproject.repository.UserRepository;
import com.example.sixthproject.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.List;
import java.util.Collections;

@RestController
@RequestMapping("/api/v1/users") // 🔥 URL дәл осылай болуы керек
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final UserService service;

    // --- 1. АВАТАР ЖҮКТЕУ ---
    @PostMapping(value = "/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadAvatar(
            @RequestParam("file") MultipartFile file,
            Principal principal
    ) {
        service.uploadAvatar(principal.getName(), file);
        return ResponseEntity.ok("Avatar updated successfully via MinIO!");
    }

    // --- 2. АВАТАРДЫ КӨРУ (DOWNLOAD) ---
    // 🔥 ТҮЗЕТУ: {filename:.+} қойдым.
    // Бұл нүктесі бар файлдарды (.jpg, .png) дұрыс оқу үшін керек!
    @GetMapping("/avatar/{filename:.+}")
    public ResponseEntity<InputStreamResource> getAvatar(@PathVariable String filename) {
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG)
                .body(new InputStreamResource(service.getAvatarStream(filename)));
    }

    // --- 3. ӨЗ ПРОФИЛІН КӨРУ (ME) ---
    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(Principal principal) {
        // 🔥 ТҮЗЕТУ: findByEmail емес, findByUsername!
        // Себебі principal.getName() енді никнеймді қайтарады.
        return userRepository.findByUsername(principal.getName())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // --- 4. ПРОФИЛЬДІ ӨЗГЕРТУ (Edit Profile) ---
    @PutMapping("/me")
    public ResponseEntity<User> updateCurrentUser(@RequestBody UpdateUserRequest request, Principal principal) {
        if (principal == null) return ResponseEntity.status(401).build();

        // 🔥 ТҮЗЕТУ: Мұнда да findByUsername болуы керек!
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // UserService арқылы жаңартамыз (таза код үшін)
        service.updateUser(user, request);

        // Bio-ны осы жерде де қоса салуға болады немесе сервиске жібер
        if (request.getBio() != null) user.setBio(request.getBio());

        // Аватар URL келсе (MinIO емес, жай ссылка болса)
        if (request.getAvatarUrl() != null) user.setAvatarUrl(request.getAvatarUrl());

        return ResponseEntity.ok(userRepository.save(user));
    }

    // --- 5. PASSWORD ӨЗГЕРТУ ---
    @PutMapping("/password")
    public ResponseEntity<?> changePassword(@RequestBody java.util.Map<String, String> request, Principal principal) {
        // 🔥 ТҮЗЕТУ: findByUsername
        User user = userRepository.findByUsername(principal.getName()).orElseThrow();

        String oldPass = request.get("oldPassword");
        String newPass = request.get("newPassword");

        if (!user.getPassword().equals(oldPass)) {
            return ResponseEntity.status(400).body("Ескі құпия сөз қате!");
        }

        user.setPassword(newPass);
        userRepository.save(user);
        return ResponseEntity.ok("Құпия сөз өзгертілді!");
    }

    // --- 6. SETTINGS ---
    @PutMapping("/settings")
    public ResponseEntity<User> updateSettings(@RequestBody UpdateUserRequest request, Principal principal) {
        // 🔥 ТҮЗЕТУ: findByUsername
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getCity() != null) user.setCity(request.getCity());
        if (request.getInterests() != null) user.setInterests(request.getInterests());
        if (request.getIsPrivate() != null) user.setPrivate(request.getIsPrivate());
        if (request.getShowOnlineStatus() != null) user.setShowOnlineStatus(request.getShowOnlineStatus());
        if (request.getPushNotifications() != null) user.setPushNotifications(request.getPushNotifications());
        if (request.getEmailNotifications() != null) user.setEmailNotifications(request.getEmailNotifications());

        // Негізгі инфоларды да жаңарту
        service.updateUser(user, request);

        return ResponseEntity.ok(userRepository.save(user));
    }

    // --- 7. FOLLOW / UNFOLLOW ---
    @PostMapping("/{id}/follow")
    public ResponseEntity<?> followUser(@PathVariable Long id, Principal principal) {
        // 🔥 ТҮЗЕТУ: findByUsername
        User currentUser = userRepository.findByUsername(principal.getName()).orElseThrow();
        User userToFollow = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));

        if (currentUser.getFollowing() == null) {
            currentUser.setFollowing(new java.util.HashSet<>());
        }

        if (currentUser.getFollowing().contains(userToFollow)) {
            currentUser.getFollowing().remove(userToFollow);
            userRepository.save(currentUser);
            return ResponseEntity.ok("Unfollowed");
        } else {
            currentUser.getFollowing().add(userToFollow);
            userRepository.save(currentUser);
            return ResponseEntity.ok("Followed");
        }
    }

    // --- 8. ІЗДЕУ (SEARCH) ---
    @GetMapping("/search")
    public ResponseEntity<List<User>> searchUsers(@RequestParam String query) {
        if (query == null || query.trim().isEmpty()) {
            return ResponseEntity.ok(Collections.emptyList());
        }
        return ResponseEntity.ok(userRepository.searchUsers(query));
    }

    // --- 9. Followers/Following Lists ---
    @GetMapping("/{id}/followers-list")
    public ResponseEntity<List<User>> getFollowersList(@PathVariable Long id) {
        return ResponseEntity.ok(userRepository.findByFollowingId(id));
    }

    @GetMapping("/{id}/following-list")
    public ResponseEntity<List<User>> getFollowingList(@PathVariable Long id) {
        return ResponseEntity.ok(userRepository.findByFollowersId(id));
    }

    // --- 10. АККАУНТТЫ ӨШІРУ ---
    @DeleteMapping("/me")
    public ResponseEntity<?> deleteAccount(Principal principal) {
        User user = userRepository.findByUsername(principal.getName()).orElseThrow();
        userRepository.delete(user);
        return ResponseEntity.ok("Аккаунт толықтай өшірілді.");
    }
}