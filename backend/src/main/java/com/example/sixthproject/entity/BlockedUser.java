package com.example.sixthproject.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "blocked_users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BlockedUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "blocker_id")
    private User blocker; // Кім блоктады?

    @ManyToOne
    @JoinColumn(name = "blocked_id")
    private User blocked; // Кімді блоктады?

    @CreationTimestamp
    private LocalDateTime blockedAt;
}