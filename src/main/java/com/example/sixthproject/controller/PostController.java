package com.example.sixthproject.controller;

import com.example.sixthproject.entity.Post;
import com.example.sixthproject.entity.User;
import com.example.sixthproject.repository.PostRepository;
import com.example.sixthproject.repository.UserRepository;
import com.example.sixthproject.service.PostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.security.Principal;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;
    private final UserRepository userRepository;
    private final PostRepository postRepository;


    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Post> createPost(
            @RequestParam("caption") String caption,
            @RequestParam("file") MultipartFile file,
            Principal principal
    ) {
        if (principal == null) {
            throw new RuntimeException("Сіз жүйеге кірмегенсіз!");
        }
        Post post = postService.createPost(principal.getName(), caption, file);
        return ResponseEntity.ok(post);
    }


    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts() {
        return ResponseEntity.ok(postService.getAllPosts());
    }
    @PostMapping("/{postId}/save")
    public ResponseEntity<String> toggleSavePost(@PathVariable Long postId, Principal principal) {

        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));


        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));


        if (user.getSavedPosts().contains(post)) {
            user.getSavedPosts().remove(post);
            userRepository.save(user);
            return ResponseEntity.ok("Post removed from saved 🗑️");
        }
        else {
            user.getSavedPosts().add(post);
            userRepository.save(user);
            return ResponseEntity.ok("Post saved successfully 💾");
        }
    }


    @GetMapping("/saved")
    public ResponseEntity<Set<Post>> getSavedPosts(Principal principal) {
        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        return ResponseEntity.ok(user.getSavedPosts());
    }


    @GetMapping("/feed")
    public ResponseEntity<List<Post>> getFeed(Principal principal) {
        return ResponseEntity.ok(postService.getFeedPosts(principal.getName()));
    }
}