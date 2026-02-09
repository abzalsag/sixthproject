package com.example.sixthproject.exception;


import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice // <--- Бұл аннотация класты "Күзетші" етеді
public class GlobalExceptionHandler {

    // 1. Егер ресурс табылмаса (Мысалы: ID қате болса)
    // Сіз кейін арнайы "ResourceNotFoundException" жазсаңыз, осы жерге қосамыз.

    // 2. Кез келген түсініксіз қателер (Exception.class)
    @ExceptionHandler(Exception.class)
    public ResponseEntity<AppError> handleGlobalException(Exception ex) {
        // Логқа қатені жазып аламыз (консольге)
        System.out.println("ҚАТЕ ШЫҚТЫ: " + ex.getMessage());

        // Frontend-ке әдемі жауап дайындаймыз
        AppError error = new AppError(
                HttpStatus.INTERNAL_SERVER_ERROR.value(), // 500 коды
                ex.getMessage() // Қатенің мәтіні
        );

        return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
