package com.example.sixthproject.controller;

import com.example.sixthproject.entity.Story;
import com.example.sixthproject.entity.User;
import com.example.sixthproject.repository.StoryRepository;
import com.example.sixthproject.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stories")
@RequiredArgsConstructor
public class StoryController {

    private final StoryRepository storyRepository;
    private final UserRepository userRepository;


    @PostMapping
    public ResponseEntity<Story> createStory(@RequestBody Map<String, String> request, Principal principal) {
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