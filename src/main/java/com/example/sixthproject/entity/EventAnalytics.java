package com.example.sixthproject.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "event_analytics")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventAnalytics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne
    @JoinColumn(name = "event_id")
    @JsonIgnore
    private Event event;

    private Integer views = 0;
    private Integer shares = 0;
    private Integer ticketsSold = 0;
    private Double revenue = 0.0;
}