package com.example.sixthproject.service;

import com.example.sixthproject.entity.PushToken;
import com.example.sixthproject.entity.User;
import com.example.sixthproject.repository.PushTokenRepository;
import com.google.firebase.messaging.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PushNotificationService {

    private final PushTokenRepository pushTokenRepository;

    // FCM Token тіркеу
    public void registerToken(User user, String fcmToken, String deviceType) {
        PushToken token = pushTokenRepository.findByFcmToken(fcmToken)
                .orElse(PushToken.builder()
                        .user(user)
                        .fcmToken(fcmToken)
                        .deviceType(deviceType)
                        .build());

        pushTokenRepository.save(token);
    }

    // Бір пайдаланушыға notification жіберу
    public void sendToUser(User user, String title, String body, String imageUrl) {
        if (!user.isPushNotifications()) {
            return; // Пайдаланушы push-ты өшірген
        }

        List<PushToken> tokens = pushTokenRepository.findByUser(user);

        for (PushToken token : tokens) {
            try {
                Message message = Message.builder()
                        .setToken(token.getFcmToken())
                        .setNotification(Notification.builder()
                                .setTitle(title)
                                .setBody(body)
                                .setImage(imageUrl)
                                .build())
                        .build();

                FirebaseMessaging.getInstance().send(message);
            } catch (Exception e) {
                System.err.println("Push жіберу қатесі: " + e.getMessage());
            }
        }
    }

    // Көп пайдаланушыларға жіберу
    public void sendToMultipleUsers(List<User> users, String title, String body) {
        for (User user : users) {
            sendToUser(user, title, body, null);
        }
    }
}