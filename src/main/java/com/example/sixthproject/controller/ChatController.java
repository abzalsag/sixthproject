package com.example.sixthproject.controller;

import com.example.sixthproject.entity.Chat;
import com.example.sixthproject.entity.Message;
import com.example.sixthproject.entity.User;
import com.example.sixthproject.repository.MessageRepository;
import com.example.sixthproject.repository.UserRepository;
import com.example.sixthproject.service.ChatService;
import jakarta.persistence.Column;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chats")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final UserRepository userRepository;
    private final MessageRepository messageRepository;

    @PostMapping("/create")
    public ResponseEntity<Chat> createChat(@RequestBody Map<String, Long> request, Principal principal) {
        Long user2Id = request.get("userId");
        return ResponseEntity.ok(chatService.getOrCreateChat(principal.getName(), user2Id));
    }

    @GetMapping("/my-chats")
    public ResponseEntity<List<Chat>> getMyChats(Principal principal) {
        return ResponseEntity.ok(chatService.getMyChats(principal.getName()));
    }

    @PostMapping("/{chatId}/send")
    public ResponseEntity<Message> sendMessage(
            @PathVariable Long chatId,
            @RequestBody Map<String, String> request,
            Principal principal
    ) {
        String content = request.get("content");
        return ResponseEntity.ok(chatService.sendMessage(chatId, principal.getName(), content));
    }

    @GetMapping("/{chatId}/messages")
    public ResponseEntity<List<Message>> getMessages(@PathVariable Long chatId) {
        return ResponseEntity.ok(chatService.getMessages(chatId));
    }

    // Оқылмаған хабарламалар саны
    @GetMapping("/unread-count")
    public ResponseEntity<Integer> getUnreadCount(Principal principal) {
        User user = userRepository.findByUsername(principal.getName()).orElseThrow();

        List<Chat> myChats = chatService.getMyChats(principal.getName());

        int unreadCount = 0;
        for (Chat chat : myChats) {
            for (Message msg : chat.getMessages()) {
                if (!msg.isRead() && !msg.getSender().getId().equals(user.getId())) {
                    unreadCount++;
                }
            }
        }

        return ResponseEntity.ok(unreadCount);
    }

    // Хабарламаны оқылған деп белгілеу
    @PostMapping("/messages/{messageId}/mark-read")
    public ResponseEntity<?> markAsRead(@PathVariable Long messageId) {
        return messageRepository.findById(messageId).map(message -> {
            message.setRead(true);
            messageRepository.save(message);
            return ResponseEntity.ok("Оқылды");
        }).orElse(ResponseEntity.notFound().build());
    }
}