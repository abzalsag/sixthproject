package com.example.sixthproject.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendWelcomeEmail(String toEmail, String username) {
        SimpleMailMessage message = new SimpleMailMessage();

        message.setFrom("SENIN_POCHTAN@gmail.com");
        message.setTo(toEmail);
        message.setSubject("Welcome to tusa! 🎉");
        message.setText("Сәлем, " + username + "!\n\n" +
                "Welcome to our wonderful social network!\n" +
                "You have successfully registered. Now find your friends and post.\n\n" +
                "Sincerely,\ntusa  Team 😎");

        mailSender.send(message);
        System.out.println("Mail sent successfully to " + toEmail);
    }

    public void sendResetCode(String toEmail, String code) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("abzalsag@gmail.com");
        message.setTo(toEmail);
        message.setSubject("Password Reset Code 🔑");
        message.setText("Hello!\n\n" +
                "You have requested a password reset.\n" +
                "Your confirmation code: " + code + "\n\n" +
                "This code is valid for 15 minutes.\n" +
                "If you are not asked, please ignore this letter.");

        mailSender.send(message);
        System.out.println("Reset code sent to " + toEmail);
    }
}