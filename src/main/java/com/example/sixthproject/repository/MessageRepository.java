package com.example.sixthproject.repository;

import com.example.sixthproject.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {

    List<Message> findAllByChatId(Long chatId);
}