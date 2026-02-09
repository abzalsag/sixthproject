package com.example.sixthproject.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UpdateUserRequest {
    private String firstname;
    private String lastname;
    private String password;
    private String avatarUrl;
    private String city;
    private String bio;
    private Boolean isPrivate;
    private Boolean showOnlineStatus;
    private Boolean pushNotifications;
    private Boolean emailNotifications;
    private String interests;// Егер пароль ауыстырғысы келсе
}