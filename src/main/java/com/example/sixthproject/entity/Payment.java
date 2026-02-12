package com.example.sixthproject.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn(name = "event_id")
    private Event event;

    @OneToOne
    @JoinColumn(name = "ticket_id")
    private Ticket ticket;

    @Column(unique = true)
    private String stripePaymentIntentId; // pi_xxxxx

    private BigDecimal amount;

    private String currency; // KZT

    @Enumerated(EnumType.STRING)
    private PaymentStatus status; // PENDING, SUCCEEDED, FAILED, REFUNDED

    private String paymentMethod; // card, kaspi, etc

    @CreationTimestamp
    private LocalDateTime createdAt;

    private LocalDateTime completedAt;

    private String failureReason;
}