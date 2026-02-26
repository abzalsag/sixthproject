package com.example.sixthproject.repository;

import com.example.sixthproject.entity.Post;
import com.example.sixthproject.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {

    List<Post> findAllByOrderByCreatedAtDesc();

    List<Post> findByUserInOrderByCreatedAtDesc(Collection<User> users);

}