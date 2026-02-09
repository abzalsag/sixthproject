package com.example.sixthproject.controller;

import com.example.sixthproject.entity.Chat;
import com.example.sixthproject.entity.Message;
import com.example.sixthproject.service.ChatService;
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

    // 1. Чат ашу
    @PostMapping("/create")
    public ResponseEntity<Chat> createChat(@RequestBody Map<String, Long> request, Principal principal) {
        Long user2Id = request.get("userId");
        return ResponseEntity.ok(chatService.getOrCreateChat(principal.getName(), user2Id));
    }

    // 2. Менің чаттарым (Тізім)
    @GetMapping("/my-chats")
    public ResponseEntity<List<Chat>> getMyChats(Principal principal) {
        return ResponseEntity.ok(chatService.getMyChats(principal.getName()));
    }

    // 3. Хабарлама жазу
    @PostMapping("/{chatId}/send")
    public ResponseEntity<Message> sendMessage(
            @PathVariable Long chatId,
            @RequestBody Map<String, String> request,
            Principal principal
    ) {
        String content = request.get("content");
        return ResponseEntity.ok(chatService.sendMessage(chatId, principal.getName(), content));
    }

    // 4. Хабарламаларды алу
    @GetMapping("/{chatId}/messages")
    public ResponseEntity<List<Message>> getMessages(@PathVariable Long chatId) {
        return ResponseEntity.ok(chatService.getMessages(chatId));
    }
}