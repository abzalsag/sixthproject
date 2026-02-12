package com.example.sixthproject.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

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

    private Integer likes = 0;

    @ManyToMany
    @JoinTable(
            name = "community_post_likes",
            joinColumns = @JoinColumn(name = "post_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    @JsonIgnore
    private Set<User> likedBy = new HashSet<>();
}