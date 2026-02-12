package com.example.sixthproject.service;

import com.example.sixthproject.dto.AuthenticationRequest;
import com.example.sixthproject.dto.AuthenticationResponse;
import com.example.sixthproject.dto.RegisterRequest;
import com.example.sixthproject.entity.Role;
import com.example.sixthproject.entity.User;
import com.example.sixthproject.repository.UserRepository;
import com.example.sixthproject.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    public AuthenticationResponse register(RegisterRequest request) {
        var user = User.builder()
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .email(request.getEmail())
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();

        repository.save(user);

        var jwtToken = jwtUtils.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }


    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        var user = repository.findByUsername(request.getUsername())
                .orElseThrow();

        var jwtToken = jwtUtils.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }


    public void forgotPassword(String email) {

        var user = repository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));


        String code = String.valueOf((int) (Math.random() * 9000) + 1000);


        user.setVerificationCode(code);
        user.setVerificationCodeExpiresAt(LocalDateTime.now().plusMinutes(15));
        repository.save(user);


        emailService.sendResetCode(email, code);
    }

    public void resetPassword(String email, String code, String newPassword) {
        var user = repository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));


        if (user.getVerificationCode() == null || !user.getVerificationCode().equals(code)) {
            throw new RuntimeException("Қате код! (Invalid Code)");
        }

        if (user.getVerificationCodeExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Кодтың уақыты өтіп кеткен! (Code Expired)");
        }


        user.setPassword(passwordEncoder.encode(newPassword));
        user.setVerificationCode(null);
        user.setVerificationCodeExpiresAt(null);
        repository.save(user);
    }
}