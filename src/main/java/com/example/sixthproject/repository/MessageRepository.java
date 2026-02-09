package com.example.sixthproject.repository;

import com.example.sixthproject.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MessageRepository extends JpaRepository<Message, Long> {
}