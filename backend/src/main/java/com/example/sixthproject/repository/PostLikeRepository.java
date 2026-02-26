package com.example.sixthproject.repository;

import com.example.sixthproject.entity.Post;
import com.example.sixthproject.entity.PostLike;
import com.example.sixthproject.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public interface PostLikeRepository extends JpaRepository<PostLike, Long> {

    boolean existsByUserAndPost(User user, Post post);


    Optional<PostLike> findByUserAndPost(User user, Post post);


    @Transactional
    void deleteByUserAndPost(User user, Post post);
}