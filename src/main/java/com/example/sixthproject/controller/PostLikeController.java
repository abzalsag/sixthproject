package com.example.sixthproject.controller;

import com.example.sixthproject.entity.Post;
import com.example.sixthproject.entity.PostLike;
import com.example.sixthproject.entity.User;
import com.example.sixthproject.repository.PostLikeRepository;
import com.example.sixthproject.repository.PostRepository;
import com.example.sixthproject.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/posts/likes")
@RequiredArgsConstructor
public class PostLikeController {

    private final PostLikeRepository postLikeRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;


    @PostMapping("/{postId}")
    public ResponseEntity<String> toggleLike(@PathVariable Long postId, Principal principal) {
        if (principal == null) return ResponseEntity.status(401).body("Not authorized");


        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (postLikeRepository.existsByUserAndPost(user, post)) {

            postLikeRepository.deleteByUserAndPost(user, post);


            post.setLikesCount(post.getLikesCount() - 1);
            postRepository.save(post);

            return ResponseEntity.ok("UNLIKED");
        } else {

            PostLike newLike = PostLike.builder()
                    .user(user)
                    .post(post)
                    .build();
            postLikeRepository.save(newLike);


            post.setLikesCount(post.getLikesCount() + 1);
            postRepository.save(post);

            return ResponseEntity.ok("LIKED");
        }
    }
}