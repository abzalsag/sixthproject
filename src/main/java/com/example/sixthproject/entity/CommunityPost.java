package com.example.sixthproject.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "community_posts")
public class CommunityPost {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String content;
    private String type;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User author;

    private LocalDateTime createdAt;

    @ElementCollection
    private List<String> pollOptions;

    @ElementCollection
    private Map<String, Integer> pollVotes;
}