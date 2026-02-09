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

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;

    // --- ТІРКЕЛУ ---
    public AuthenticationResponse register(RegisterRequest request) {
        var user = User.builder()
                .firstname(request.getFirstname())
                .lastname(request.getLastname())
                .email(request.getEmail())
                .username(request.getUsername()) // 🔥 МАҢЫЗДЫ: Никнеймді базаға сақтаймыз!
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();

        repository.save(user);

        var jwtToken = jwtUtils.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }

    // --- КІРУ (LOGIN) ---
    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        // 1. AuthenticationManager-ге Username жібереміз
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(), // 👈 ӨЗГЕРДІ: getEmail() -> getUsername()
                        request.getPassword()
                )
        );

        // 2. Базадан USERNAME бойынша іздейміз
        var user = repository.findByUsername(request.getUsername()) // 👈 ӨЗГЕРДІ: findByEmail -> findByUsername
                .orElseThrow();

        var jwtToken = jwtUtils.generateToken(user);
        return AuthenticationResponse.builder()
                .token(jwtToken)
                .build();
    }
}