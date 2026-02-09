package com.example.sixthproject.repository;


import com.example.sixthproject.entity.Comment;
import com.example.sixthproject.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {
    // Тусовканың барлық комментарийлерін алу
    List<Comment> findByEvent(Event event);
}
