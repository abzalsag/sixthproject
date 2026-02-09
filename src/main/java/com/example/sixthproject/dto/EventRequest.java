package com.example.sixthproject.dto;


import lombok.Data;
import java.math.BigDecimal; // <--- ОСЫНЫ ҚОСУ КЕРЕК
import java.time.LocalDateTime;

@Data
public class EventRequest {
    private String title;
    private String description;
    private String location;
    private LocalDateTime eventDate;

    // Бұрын Double болған, енді BigDecimal қыламыз
    private BigDecimal price;

    private Integer totalTickets;
    private Long organizerId;
}