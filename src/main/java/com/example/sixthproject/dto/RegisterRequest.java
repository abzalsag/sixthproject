package com.example.sixthproject.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {

    @NotBlank(message = "Your name must not be empty")
    private String firstname;

    @NotBlank(message = "Your last name must not be empty")
    private String lastname;

    @Email(message = "Email format is incorrect")
    @NotBlank(message = "Email must be written")
    private String email;

    @NotBlank(message = "Password must not be empty")
    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String password;

    @NotBlank(message = "Username must not be empty")
    private String username;
}