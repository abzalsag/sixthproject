package com.example.sixthproject.repository;

import com.example.sixthproject.entity.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {


    List<Comment> findAllByPostId(Long postId);


    List<Comment> findAllByEventId(Long eventId);
}