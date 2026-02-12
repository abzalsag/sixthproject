package com.example.sixthproject.service;

import com.example.sixthproject.entity.Chat;
import com.example.sixthproject.entity.Message;
import com.example.sixthproject.entity.User;
import com.example.sixthproject.repository.ChatRepository;
import com.example.sixthproject.repository.MessageRepository;
import com.example.sixthproject.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRepository chatRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;


    public Chat getOrCreateChat(String currentUsername, Long user2Id) {

        User user1 = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new RuntimeException("Current User not found"));

        User user2 = userRepository.findById(user2Id)
                .orElseThrow(() -> new RuntimeException("Target User not found"));


        return chatRepository.findChatByUsers(user1, user2)
                .orElseGet(() -> {
                    Chat newChat = Chat.builder()
                            .user1(user1)
                            .user2(user2)
                            .createdAt(LocalDateTime.now())
                            .build();
                    return chatRepository.save(newChat);
                });
    }


    public List<Chat> getMyChats(String currentUsername) {
        User user = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return chatRepository.findChatsByUser(user);
    }


    public Message sendMessage(Long chatId, String senderUsername, String content) {
        Chat chat = chatRepository.findById(chatId)
                .orElseThrow(() -> new RuntimeException("Chat not found"));

        User sender = userRepository.findByUsername(senderUsername)
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        Message message = Message.builder()
                .chat(chat)
                .sender(sender)
                .content(content)
                .timestamp(LocalDateTime.now())
                .build();

        return messageRepository.save(message);
    }


    public List<Message> getMessages(Long chatId) {

        return messageRepository.findAllByChatId(chatId);
    }
}