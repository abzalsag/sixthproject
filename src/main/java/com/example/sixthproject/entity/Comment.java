package com.example.sixthproject.entity;

import com.fasterxml.jackson.annotation.JsonIgnore; // Осыны қосу маңызды
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "comments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 🔥 ӨЗГЕРІС: "text" емес, "content" болуы керек (React-пен сәйкес келу үшін)
    @Column(nullable = false)
    private String content;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    @JsonIgnore // 🔥 Бұл шексіз циклге түсіп кетпес үшін керек
    private Event event;

    @CreationTimestamp
    private LocalDateTime createdAt;
}