package com.example.sixthproject.controller;

import com.example.sixthproject.dto.UpdateUserRequest;
import com.example.sixthproject.entity.User;
import com.example.sixthproject.repository.CommentRepository;
import com.example.sixthproject.repository.EventRepository;
import com.example.sixthproject.repository.TicketRepository;
import com.example.sixthproject.repository.UserRepository;
import com.example.sixthproject.service.NotificationService;
import com.example.sixthproject.service.PrivacyService;
import com.example.sixthproject.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Collections;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final UserService service;
    private final PasswordEncoder passwordEncoder;
    private final EventRepository eventRepository;
    private final TicketRepository ticketRepository;
    private final CommentRepository commentRepository;


    @PostMapping(value = "/avatar", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> uploadAvatar(@RequestParam("file") MultipartFile file, Principal principal) {
        service.uploadAvatar(principal.getName(), file);
        return ResponseEntity.ok("Avatar updated successfully!");
    }


    @GetMapping("/avatar/{filename:.+}")
    public ResponseEntity<InputStreamResource> getAvatar(@PathVariable String filename) {
        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG)
                .body(new InputStreamResource(service.getAvatarStream(filename)));
    }


    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(Principal principal) {
        return userRepository.findByUsername(principal.getName())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    @PutMapping("/me")
    public ResponseEntity<User> updateCurrentUser(@RequestBody UpdateUserRequest request, Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        service.updateUser(user, request);
        return ResponseEntity.ok(userRepository.save(user));
    }


    @PutMapping("/password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> request, Principal principal) {
        User user = userRepository.findByUsername(principal.getName()).orElseThrow();

        String oldPass = request.get("oldPassword");
        String newPass = request.get("newPassword");


        if (!passwordEncoder.matches(oldPass, user.getPassword())) {
            return ResponseEntity.status(400).body("Ескі құпия сөз қате! ❌");
        }

        user.setPassword(passwordEncoder.encode(newPass));
        userRepository.save(user);
        return ResponseEntity.ok("Құпия сөз сәтті өзгертілді! ✅");
    }


    @PutMapping("/settings")
    public ResponseEntity<User> updateSettings(@RequestBody UpdateUserRequest request, Principal principal) {
        User user = userRepository.findByUsername(principal.getName()).orElseThrow();

        service.updateUser(user, request);
        return ResponseEntity.ok(userRepository.save(user));
    }

    @Autowired
    private PrivacyService privacyService; // Жаңа қосу

    // --- 3. БАСҚА АДАМНЫҢ ПРОФИЛІН КӨРУ ---
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id, Principal principal) {
        User viewer = userRepository.findByUsername(principal.getName()).orElseThrow();
        User profileOwner = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 🔥 ЖАҢА: Privacy тексеру
        if (!privacyService.canViewProfile(viewer, profileOwner)) {
            return ResponseEntity.status(403).build(); // Forbidden
        }

        return ResponseEntity.ok(profileOwner);
    }



    @Autowired
    private NotificationService notificationService; // Жаңа қосу

    @PostMapping("/{id}/follow")
    public ResponseEntity<?> followUser(@PathVariable Long id, Principal principal) {
        User currentUser = userRepository.findByUsername(principal.getName()).orElseThrow();
        User userToFollow = userRepository.findById(id).orElseThrow();

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

            // 🔥 ЖАҢА: Хабарландыру жіберу
            notificationService.createFollowNotification(currentUser, userToFollow);

            return ResponseEntity.ok("Followed");
        }
    }


    @GetMapping("/search")
    public ResponseEntity<List<User>> searchUsers(@RequestParam String query) {
        if (query == null || query.trim().isEmpty()) {
            return ResponseEntity.ok(Collections.emptyList());
        }
        return ResponseEntity.ok(userRepository.searchUsers(query));
    }


    // Пайдаланушының белсенділігі
    @GetMapping("/{id}/activity")
    public ResponseEntity<Map<String, Object>> getUserActivity(@PathVariable Long id) {
        User user = userRepository.findById(id).orElseThrow();

        Map<String, Object> activity = new HashMap<>();

        // Ұйымдастырған ивенттер саны
        long organizedEvents = eventRepository.findAll().stream()
                .filter(e -> e.getOrganizer() != null && e.getOrganizer().getId().equals(id))
                .count();

        // Сатып алған билеттер саны
        long ticketsBought = ticketRepository.findAll().stream()
                .filter(t -> t.getUser().getId().equals(id))
                .count();

        // Жазған комментарийлер саны
        long commentsCount = commentRepository.findAll().stream()
                .filter(c -> c.getUser().getId().equals(id))
                .count();

        // Басқан лайктар саны
        long likesGiven = eventRepository.findAll().stream()
                .filter(e -> e.getLikedBy().stream().anyMatch(u -> u.getId().equals(id)))
                .count();

        activity.put("organizedEvents", organizedEvents);
        activity.put("ticketsBought", ticketsBought);
        activity.put("commentsCount", commentsCount);
        activity.put("likesGiven", likesGiven);

        return ResponseEntity.ok(activity);
    }



    @GetMapping("/{id}/followers-list")
    public ResponseEntity<List<User>> getFollowersList(@PathVariable Long id) {
        return ResponseEntity.ok(userRepository.findByFollowingId(id)); // Керісінше логика
    }

    @GetMapping("/{id}/following-list")
    public ResponseEntity<List<User>> getFollowingList(@PathVariable Long id) {
        return ResponseEntity.ok(userRepository.findByFollowersId(id)); // Керісінше логика
    }

    @DeleteMapping("/me")
    public ResponseEntity<?> deleteAccount(Principal principal) {
        User user = userRepository.findByUsername(principal.getName()).orElseThrow();
        userRepository.delete(user);
        return ResponseEntity.ok("Аккаунт өшірілді 👋");
    }
}