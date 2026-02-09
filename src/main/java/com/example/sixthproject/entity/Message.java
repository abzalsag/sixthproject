package com.example.sixthproject.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Builder // 🔥 ОСЫ ЖОЛ (Builder) БОЛМАҒАНДЫҚТАН ҚАТЕ ШЫҚТЫ
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "messages")
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Қай чатқа тиесілі?
    @ManyToOne
    @JoinColumn(name = "chat_id")
    @JsonIgnore // Тұйық цикл болмас үшін
    private Chat chat;

    // Кім жазды?
    @ManyToOne
    @JoinColumn(name = "sender_id")
    private User sender;

    private String content; // Хабарлама мәтіні

    private LocalDateTime timestamp; // Уақыты
}