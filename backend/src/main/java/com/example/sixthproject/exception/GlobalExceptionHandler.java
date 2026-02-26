package com.example.sixthproject.exception; // Пакет аты сенде басқа болуы мүмкін

import com.stripe.exception.StripeException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException; // Импорт дұрыс па?
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // 🔥 1. Stripe қателері үшін БӨЛЕК функция
    @ExceptionHandler(StripeException.class)
    public ResponseEntity<?> handleStripeException(StripeException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", "Stripe қатесі: " + ex.getMessage()));
    }

    // 🔥 2. Логин/Пароль қателері үшін БӨЛЕК функция
    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<?> handleAuthenticationException(AuthenticationException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("error", "Кіру қатесі: " + ex.getMessage()));
    }

    // 🔥 3. Жалпы түсініксіз қателер үшін
    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleGlobalException(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Жүйелік қате: " + ex.getMessage()));
    }



    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<AppError> handleNotFound(ResourceNotFoundException ex) {
        AppError error = new AppError(404, ex.getMessage());
        return new ResponseEntity<>(error, HttpStatus.NOT_FOUND);
    }
}