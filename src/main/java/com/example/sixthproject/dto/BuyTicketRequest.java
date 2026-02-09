package com.example.sixthproject.dto;


import lombok.Data;

@Data
public class BuyTicketRequest {
    private Long userId;   // Кім алады?
    private Long eventId;  // Қай концертке алады?
}