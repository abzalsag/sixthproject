package com.example.sixthproject.controller;

import com.example.sixthproject.entity.Comment;
import com.example.sixthproject.entity.Post;
import com.example.sixthproject.entity.User;
import com.example.sixthproject.repository.CommentRepository;
import com.example.sixthproject.repository.PostRepository;
import com.example.sixthproject.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;


    @PostMapping("/{postId}")
    public ResponseEntity<Comment> addComment(
            @PathVariable Long postId,
            @RequestBody Map<String, String> body,
            Principal principal
    ) {
        if (principal == null) return ResponseEntity.status(401).build();


        User user = userRepository.findByUsername(principal.getName())
                .orElseThrow(() -> new RuntimeException("User табылмады"));


        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post табылмады"));


        Comment comment = Comment.builder()
                .content(body.get("content"))
                .user(user)
                .post(post)
                .build();

        return ResponseEntity.ok(commentRepository.save(comment));
    }
    @GetMapping("/post/{postId}")
    public ResponseEntity<List<Comment>> getCommentsByPost(@PathVariable Long postId) {
        return ResponseEntity.ok(commentRepository.findAllByPostId(postId));
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id) {
        if (commentRepository.existsById(id)) {
            commentRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}