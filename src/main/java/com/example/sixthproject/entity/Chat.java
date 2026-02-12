package com.example.sixthproject.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "chats")
public class Chat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 🔥 ЖАҢА: Чат атауы
    private String chatName;

    // 🔥 ЖАҢА: Топтық чат па?
    private boolean isGroupChat;

    // 🔥 ЖАҢА: Көп қатысушылар
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "chat_participants",
            joinColumns = @JoinColumn(name = "chat_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @JsonIgnore
    private Set<User> participants = new HashSet<>();

    // ЕСКІ: 1-на-1 чат үшін (сақталады)
    @ManyToOne
    @JoinColumn(name = "user1_id")
    private User user1;

    @ManyToOne
    @JoinColumn(name = "user2_id")
    private User user2;

    @OneToMany(mappedBy = "chat", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Message> messages;

    private LocalDateTime createdAt;
}