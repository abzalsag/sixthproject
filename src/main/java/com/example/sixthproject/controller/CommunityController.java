package com.example.sixthproject.controller;

import com.example.sixthproject.entity.CommunityPost;
import com.example.sixthproject.entity.User;
import com.example.sixthproject.repository.CommunityRepository;
import com.example.sixthproject.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.HashMap;

@RestController
@RequestMapping("/api/community")
@RequiredArgsConstructor
public class CommunityController {

    private final CommunityRepository communityRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<?> getAllPosts() {
        return ResponseEntity.ok(communityRepository.findAllByOrderByCreatedAtDesc());
    }

    @PostMapping
    public ResponseEntity<?> createPost(@RequestBody CommunityPost post, Principal principal) {
        User user = userRepository.findByEmail(principal.getName()).orElseThrow();
        post.setAuthor(user);
        post.setCreatedAt(LocalDateTime.now());

        if ("POLL".equals(post.getType()) && post.getPollOptions() != null) {
            post.setPollVotes(new HashMap<>());
            for (String option : post.getPollOptions()) {
                post.getPollVotes().put(option, 0);
            }
        }
        return ResponseEntity.ok(communityRepository.save(post));
    }

    @PostMapping("/{id}/vote")
    public ResponseEntity<?> vote(@PathVariable Long id, @RequestParam String option) {
        return communityRepository.findById(id).map(post -> {
            if (post.getPollVotes() != null && post.getPollVotes().containsKey(option)) {
                post.getPollVotes().put(option, post.getPollVotes().get(option) + 1);
                communityRepository.save(post);
            }
            return ResponseEntity.ok(post);
        }).orElse(ResponseEntity.notFound().build());
    }
}