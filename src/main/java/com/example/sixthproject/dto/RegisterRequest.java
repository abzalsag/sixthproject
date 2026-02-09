package com.example.sixthproject.dto;




import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    private String firstname;
    private String lastname;
    private String email;   // <--- БІЗ ОСЫНЫ ҚОЛДАНАМЫЗ
    private String password;
    private String username;
}