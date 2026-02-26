package com.example.sixthproject.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Report {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "reporter_id")
    private User reporter; // Кім шағымданды?

    @ManyToOne
    @JoinColumn(name = "reported_user_id")
    private User reportedUser; // Кімге шағымданды?

    @ManyToOne
    @JoinColumn(name = "event_id")
    private Event reportedEvent; // Қай ивентке?

    @Enumerated(EnumType.STRING)
    private ReportReason reason;

    private String description;

    @Enumerated(EnumType.STRING)
    private ReportStatus status = ReportStatus.PENDING;

    @CreationTimestamp
    private LocalDateTime createdAt;
}