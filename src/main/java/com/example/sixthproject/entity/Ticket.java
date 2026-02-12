package com.example.sixthproject.entity;



import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "tickets")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String qrCode;

    @Column(columnDefinition = "boolean default false")
    private boolean used = false;

    private LocalDateTime usedAt;


    @ManyToOne
    @JoinColumn(name = "event_id")
    private Event event;


    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String status;

    @CreationTimestamp
    private LocalDateTime boughtAt;


    @PrePersist
    protected void onCreate() {
        this.status = "ACTIVE";

        this.qrCode = "TUSA-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }
}