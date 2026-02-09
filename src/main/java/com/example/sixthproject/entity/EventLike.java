package com.example.sixthproject.entity;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "event_likes", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"user_id", "event_id"}) // Бір адам 2 рет лайк баса алмауы үшін
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventLike {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "event_id", nullable = false)
    private Event event;
}