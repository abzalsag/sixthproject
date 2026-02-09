package com.example.sixthproject.repository;

import com.example.sixthproject.entity.Chat;
import com.example.sixthproject.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ChatRepository extends JpaRepository<Chat, Long> {

    // 1. Нақты екі адамның чатын табу
    @Query("SELECT c FROM Chat c WHERE (c.user1 = :u1 AND c.user2 = :u2) OR (c.user1 = :u2 AND c.user2 = :u1)")
    Optional<Chat> findChatByUsers(@Param("u1") User user1, @Param("u2") User user2);

    // 2. Менің барлық чаттарымды тізімдеп беру (2-ші страница үшін)
    @Query("SELECT c FROM Chat c WHERE c.user1 = :user OR c.user2 = :user")
    List<Chat> findChatsByUser(@Param("user") User user);
}