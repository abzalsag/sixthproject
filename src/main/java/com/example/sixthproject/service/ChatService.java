package com.example.sixthproject.service;

import com.example.sixthproject.entity.Chat;
import com.example.sixthproject.entity.Message;
import com.example.sixthproject.entity.User;
import com.example.sixthproject.repository.ChatRepository;
import com.example.sixthproject.repository.MessageRepository;
import com.example.sixthproject.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRepository chatRepository;
    private final MessageRepository messageRepository;
    private final UserRepository userRepository;

    // 1. Чат ашу немесе барын табу
    public Chat getOrCreateChat(String email1, Long user2Id) {
        User user1 = userRepository.findByEmail(email1).orElseThrow();
        User user2 = userRepository.findById(user2Id).orElseThrow(() -> new RuntimeException("User not found"));

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

    // 2. Менің чаттарымды алу
    public List<Chat> getMyChats(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        return chatRepository.findChatsByUser(user);
    }

    // 3. Хабарлама жазу
    public Message sendMessage(Long chatId, String senderEmail, String content) {
        Chat chat = chatRepository.findById(chatId).orElseThrow();
        User sender = userRepository.findByEmail(senderEmail).orElseThrow();

        Message message = Message.builder()
                .chat(chat)
                .sender(sender)
                .content(content)
                .timestamp(LocalDateTime.now())
                .build();

        return messageRepository.save(message);
    }

    // 4. Хабарламаларды оқу
    public List<Message> getMessages(Long chatId) {
        Chat chat = chatRepository.findById(chatId).orElseThrow();
        return chat.getMessages();
    }
}