package com.example.sixthproject.controller;

import com.example.sixthproject.dto.AuthenticationRequest;
import com.example.sixthproject.dto.AuthenticationResponse;
import com.example.sixthproject.dto.RegisterRequest;
import com.example.sixthproject.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService service;

    // 1. ТІРКЕЛУ (Frontend "/register" сұрайды)
    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(
            @RequestBody RegisterRequest request
    ) {
        System.out.println("🟢 REGISTER СҰРАНЫСЫ: " + request.getEmail());
        return ResponseEntity.ok(service.register(request));
    }

    // 2. КІРУ (Frontend "/authenticate" сұрайды - ЛОГТАҒЫ ҚАТЕНІ ТҮЗЕТУ)
    // Бұрын "/login" болған, енді "/authenticate" қылдым.
    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request
    ) {
        System.out.println("🔵 LOGIN СҰРАНЫСЫ: " + request.getUsername());
        return ResponseEntity.ok(service.authenticate(request));
    }
}