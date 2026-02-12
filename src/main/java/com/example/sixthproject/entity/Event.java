package com.example.sixthproject.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "events", indexes = {
        @Index(name = "idx_event_date", columnList = "eventDate"),
        @Index(name = "idx_category", columnList = "category"),
        @Index(name = "idx_location", columnList = "location")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String location;

    private String category;

    @Column(nullable = false)
    private LocalDateTime eventDate;

    private BigDecimal price;

    private Integer totalTickets;

    private String imageUrl;

    private LocalDateTime createdAt;


    private Integer likes = 0;

    private Double averageRating = 0.0;


    @ManyToMany
    @JoinTable(
            name = "event_likes",
            joinColumns = @JoinColumn(name = "event_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @JsonIgnore
    private Set<User> likedBy = new HashSet<>();

    @ManyToOne
    @JoinColumn(name = "organizer_id")
    private User organizer;

    @OneToOne(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private EventAnalytics analytics;

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Comment> comments = new ArrayList<>();

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Ticket> tickets = new ArrayList<>();

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "chat_id")
    @JsonIgnore
    private Chat chat;

    // 🔥 ЖАҢА: Іс-шараның чаты
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "event_hashtags",
            joinColumns = @JoinColumn(name = "event_id"),
            inverseJoinColumns = @JoinColumn(name = "hashtag_id")
    )
    private Set<Hashtag> hashtags;



    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.likes == null) {
            this.likes = 0;
        }
    }
}