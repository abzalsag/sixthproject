package com.example.sixthproject.dto;


import lombok.Data;

@Data
public class FollowRequest {
    private Long followerId;   // Кім жазылып жатыр? (Мен)
    private Long followingId;  // Кімге жазылып жатыр? (Сен)
}
