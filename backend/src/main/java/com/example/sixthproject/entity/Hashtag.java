package com.example.sixthproject.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.Set;

@Entity
@Table(name = "hashtags")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Hashtag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String name; // #music, #party

    @ManyToMany(mappedBy = "hashtags")
    private Set<Event> events;

    private Integer usageCount = 0; // Trending үшін
}