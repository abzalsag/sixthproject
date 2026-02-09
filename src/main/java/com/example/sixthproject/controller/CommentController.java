package com.example.sixthproject.controller;

import com.example.sixthproject.entity.Comment; // 🔥 Импорт қосуды ұмытпа!
import com.example.sixthproject.repository.CommentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final CommentRepository commentRepository;

    // Пікірді ID арқылы өшіру
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long id) {
        if (commentRepository.existsById(id)) {
            commentRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    // Пікірді ID арқылы алу
    @GetMapping("/{id}")
    public ResponseEntity<Comment> getComment(@PathVariable Long id) { // 🔥 <Object> емес, <Comment> болуы керек
        return commentRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}