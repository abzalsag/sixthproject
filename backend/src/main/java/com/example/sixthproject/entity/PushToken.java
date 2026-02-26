package com.example.sixthproject.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "push_tokens")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PushToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(unique = true)
    private String fcmToken; // Firebase Cloud Messaging token

    private String deviceType; // "android", "ios", "web"

    @CreationTimestamp
    private LocalDateTime createdAt;
}