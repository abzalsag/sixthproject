package com.example.sixthproject.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user; // Кімге хабарландыру?

    @ManyToOne
    @JoinColumn(name = "from_user_id")
    private User fromUser; // Кімнен келді?

    @Enumerated(EnumType.STRING)
    private NotificationType type; // LIKE, COMMENT, FOLLOW, MESSAGE

    private String message; // "John liked your post"

    private String targetUrl; // "/events/123" немесе "/profile/456"

    @Column(columnDefinition = "boolean default false")
    private boolean isRead = false;

    @CreationTimestamp
    private LocalDateTime createdAt;
}