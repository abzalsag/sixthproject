package com.example.sixthproject.exception;


import java.util.Date;

public class AppError {
    private int statusCode;
    private String message;
    private Date timestamp;

    public AppError(int statusCode, String message) {
        this.statusCode = statusCode;
        this.message = message;
        this.timestamp = new Date();
    }


    public int getStatusCode() {
        return statusCode;
    }

    public void setStatusCode(int statusCode) {
        this.statusCode = statusCode;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Date getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Date timestamp) {
        this.timestamp = timestamp;
    }
}