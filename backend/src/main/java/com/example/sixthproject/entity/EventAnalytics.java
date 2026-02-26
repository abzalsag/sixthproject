package com.example.sixthproject.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "event_analytics")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EventAnalytics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "event_id", unique = true)
    @JsonIgnore
    private Event event;

    @Column(nullable = false)
    private Integer views = 0;

    @Column(nullable = false)
    private Integer shares = 0;

    @Column(nullable = false)
    private Integer ticketsSold = 0;

    @Column(nullable = false)
    private Double revenue = 0.0;

    private LocalDateTime lastUpdated;

    @PrePersist
    protected void onCreate() {
        this.lastUpdated = LocalDateTime.now();
        if (this.views == null) this.views = 0;
        if (this.shares == null) this.shares = 0;
        if (this.ticketsSold == null) this.ticketsSold = 0;
        if (this.revenue == null) this.revenue = 0.0;
    }

    @PreUpdate
    protected void onUpdate() {
        this.lastUpdated = LocalDateTime.now();
    }
}