package com.example.sixthproject.service;

import com.example.sixthproject.entity.*;
import com.example.sixthproject.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    // Жаңа жазылушы туралы хабарландыру
    public void createFollowNotification(User follower, User following) {
        Notification notification = Notification.builder()
                .user(following)
                .fromUser(follower)
                .type(NotificationType.FOLLOW)
                .message(follower.getFirstname() + " сізге жазылды")
                .targetUrl("/profile/" + follower.getId())
                .build();
        notificationRepository.save(notification);
    }

    // Лайк туралы хабарландыру
    public void createLikeNotification(User liker, Event event) {
        if (event.getOrganizer().getId().equals(liker.getId())) return; // Өзіне өзі лайк

        Notification notification = Notification.builder()
                .user(event.getOrganizer())
                .fromUser(liker)
                .type(NotificationType.LIKE)
                .message(liker.getFirstname() + " сіздің постыңызға лайк басты")
                .targetUrl("/events/" + event.getId())
                .build();
        notificationRepository.save(notification);
    }

    // Комментарий туралы хабарландыру
    public void createCommentNotification(User commenter, Event event) {
        if (event.getOrganizer().getId().equals(commenter.getId())) return;

        Notification notification = Notification.builder()
                .user(event.getOrganizer())
                .fromUser(commenter)
                .type(NotificationType.COMMENT)
                .message(commenter.getFirstname() + " сіздің постыңызға комментарий қалдырды")
                .targetUrl("/events/" + event.getId())
                .build();
        notificationRepository.save(notification);
    }

    // Хабарлама туралы хабарландыру
    public void createMessageNotification(User sender, User receiver) {
        Notification notification = Notification.builder()
                .user(receiver)
                .fromUser(sender)
                .type(NotificationType.MESSAGE)
                .message(sender.getFirstname() + " сізге хабарлама жіберді")
                .targetUrl("/chat")
                .build();
        notificationRepository.save(notification);
    }
}