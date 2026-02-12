package com.example.sixthproject.controller;

import com.example.sixthproject.entity.Notification;
import com.example.sixthproject.entity.User;
import com.example.sixthproject.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    // Барлық хабарландыруларды алу
    @GetMapping
    public ResponseEntity<List<Notification>> getNotifications(Principal principal) {
        User user = userRepository.findByUsername(principal.getName()).orElseThrow();
        return ResponseEntity.ok(notificationRepository.findByUserOrderByCreatedAtDesc(user));
    }

    // Оқылмаған хабарландырулар саны
    @GetMapping("/unread-count")
    public ResponseEntity<Long> getUnreadCount(Principal principal) {
        User user = userRepository.findByUsername(principal.getName()).orElseThrow();
        return ResponseEntity.ok(notificationRepository.countByUserAndIsReadFalse(user));
    }

    // Хабарландыруды оқылған деп белгілеу
    @PutMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(@PathVariable Long id) {
        return notificationRepository.findById(id).map(notification -> {
            notification.setRead(true);
            notificationRepository.save(notification);
            return ResponseEntity.ok("Marked as read");
        }).orElse(ResponseEntity.notFound().build());
    }

    // Барлығын оқылған деп белгілеу
    @PutMapping("/mark-all-read")
    public ResponseEntity<?> markAllAsRead(Principal principal) {
        User user = userRepository.findByUsername(principal.getName()).orElseThrow();
        List<Notification> unread = notificationRepository.findByUserAndIsReadFalseOrderByCreatedAtDesc(user);
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
        return ResponseEntity.ok("All marked as read");
    }
}