package com.example.sixthproject.controller;

import com.example.sixthproject.dto.AuthenticationRequest;
import com.example.sixthproject.dto.AuthenticationResponse;
import com.example.sixthproject.dto.RegisterRequest;
import com.example.sixthproject.service.AuthenticationService;
import com.example.sixthproject.service.EmailService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationService service;
    private final EmailService emailService;


    @PostMapping("/register")
    public ResponseEntity<AuthenticationResponse> register(
            @RequestBody @Valid RegisterRequest request
    ) {
        System.out.println("🟢 REGISTER СҰРАНЫСЫ: " + request.getEmail());


        AuthenticationResponse response = service.register(request);



        try {

            emailService.sendWelcomeEmail(request.getEmail(), request.getFirstname());
            System.out.println("📨 Хат сәтті жіберілді: " + request.getEmail());
        } catch (Exception e) {
            System.err.println("⚠️ Хат кетпеді (бірақ адам тіркелді): " + e.getMessage());
        }

        return ResponseEntity.ok(response);
    }


    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponse> authenticate(
            @RequestBody AuthenticationRequest request
    ) {
        System.out.println("🔵 LOGIN СҰРАНЫСЫ: " + request.getUsername());
        return ResponseEntity.ok(service.authenticate(request));
    }


    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody Map<String, String> request) {
        service.forgotPassword(request.get("email"));
        return ResponseEntity.ok("Verification code sent to email!");
    }


    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(@RequestBody Map<String, String> request) {
        service.resetPassword(
                request.get("email"),
                request.get("code"),
                request.get("newPassword")
        );
        return ResponseEntity.ok("Password reset successfully!");
    }
}