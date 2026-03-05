package com.example.sixthproject.controller;

import com.example.sixthproject.entity.Story;
import com.example.sixthproject.entity.User;
import com.example.sixthproject.repository.StoryRepository;
import com.example.sixthproject.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/stories")
@RequiredArgsConstructor
public class StoryController {

    private final StoryRepository storyRepository;
    private final UserRepository userRepository;

    /** Multipart файл арқылы story жасау (frontend createStory(file) қолданады) */
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Story> createStoryMultipart(
            @RequestParam("file") MultipartFile file,
            Principal principal) throws IOException {

        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Файлды uploads/ папкасына сақтаймыз
        String uploadsDir = "uploads/stories";
        new File(uploadsDir).mkdirs();
        String filename = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = Paths.get(uploadsDir, filename);
        Files.write(filePath, file.getBytes());

        String mediaUrl = "/api/files/stories/" + filename;

        Story story = Story.builder()
                .mediaUrl(mediaUrl)
                .user(user)
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusHours(24))
                .build();

        return ResponseEntity.ok(storyRepository.save(story));
    }

    /** JSON арқылы story жасау (ескі нұсқа — туберсасы үшін қалдырылды) */
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Story> createStoryJson(@RequestBody Map<String, String> request, Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Story story = Story.builder()
                .mediaUrl(request.get("mediaUrl"))
                .user(user)
                .createdAt(LocalDateTime.now())
                .expiresAt(LocalDateTime.now().plusHours(24))
                .build();

        return ResponseEntity.ok(storyRepository.save(story));
    }


    @GetMapping
    public ResponseEntity<List<Story>> getActiveStories() {
        return ResponseEntity.ok(storyRepository.findByExpiresAtAfter(LocalDateTime.now()));
    }


    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Story>> getUserStories(@PathVariable Long userId) {
        return ResponseEntity.ok(storyRepository.findByUserIdAndExpiresAtAfter(userId, LocalDateTime.now()));
    }
}
