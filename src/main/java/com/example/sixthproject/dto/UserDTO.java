package com.example.sixthproject.dto;


import lombok.Data;

@Data
public class UserDTO {
    private Long id;
    private String email;
    // Басқа өрістеріңіз болса, осында қосыңыз (мысалы: name, surname)
    // Бірақ PASSWORD жазуға болмайды! ❌

    private String role; // Егер сізде role өрісі болса
}