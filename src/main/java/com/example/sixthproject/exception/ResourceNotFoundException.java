package com.example.sixthproject.exception;



import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

// Қараңыз: "extends RuntimeException" деп тұр.
// Міне, осы сөз бұл класты "НАҒЫЗ Exception" қылады!
@ResponseStatus(HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message); // Атасына (RuntimeException) хабарламаны жібереміз
    }
}
