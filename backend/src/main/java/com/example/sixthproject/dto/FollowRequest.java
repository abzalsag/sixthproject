package com.example.sixthproject.dto;


import lombok.Data;

@Data
public class FollowRequest {
    private Long followerId;
    private Long followingId;
}
