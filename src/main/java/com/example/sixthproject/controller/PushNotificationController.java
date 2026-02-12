package com.example.sixthproject.controller;

import com.example.sixthproject.entity.User;
import com.example.sixthproject.repository.UserRepository;
import com.example.sixthproject.service.PushNotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/push")
@RequiredArgsConstructor
public class PushNotificationController {

    private final PushNotificationService pushService;
    private final UserRepository userRepository;

    // FCM Token тіркеу
    @PostMapping("/register-token")
    public ResponseEntity<?> registerToken(
            @RequestBody Map<String, String> request,
            Principal principal
    ) {
        User user = userRepository.findByUsername(principal.getName()).orElseThrow();
        String fcmToken = request.get("fcmToken");
        String deviceType = request.get("deviceType");

        pushService.registerToken(user, fcmToken, deviceType);
        return ResponseEntity.ok("Token тіркелді");
    }

    // Test notification жіберу
    @PostMapping("/test")
    public ResponseEntity<?> sendTestNotification(Principal principal) {
        User user = userRepository.findByUsername(principal.getName()).orElseThrow();
        pushService.sendToUser(user, "Test Notification", "Бұл тест хабарландыру", null);
        return ResponseEntity.ok("Test notification жіберілді");
    }
}