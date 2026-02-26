package com.example.sixthproject.controller;

import com.example.sixthproject.dto.ReportRequest;
import com.example.sixthproject.entity.*;
import com.example.sixthproject.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    private final EventRepository eventRepository;

    // Пайдаланушыға шағымдану
    @PostMapping("/user/{userId}")
    public ResponseEntity<?> reportUser(
            @PathVariable Long userId,
            @RequestBody ReportRequest request,
            Principal principal
    ) {
        User reporter = userRepository.findByUsername(principal.getName()).orElseThrow();
        User reported = userRepository.findById(userId).orElseThrow();

        Report report = Report.builder()
                .reporter(reporter)
                .reportedUser(reported)
                .reason(request.getReason())
                .description(request.getDescription())
                .build();

        reportRepository.save(report);
        return ResponseEntity.ok("Шағым жіберілді");
    }

    // Ивентке шағымдану
    @PostMapping("/event/{eventId}")
    public ResponseEntity<?> reportEvent(
            @PathVariable Long eventId,
            @RequestBody ReportRequest request,
            Principal principal
    ) {
        User reporter = userRepository.findByUsername(principal.getName()).orElseThrow();
        Event event = eventRepository.findById(eventId).orElseThrow();

        Report report = Report.builder()
                .reporter(reporter)
                .reportedEvent(event)
                .reportedUser(event.getOrganizer())
                .reason(request.getReason())
                .description(request.getDescription())
                .build();

        reportRepository.save(report);
        return ResponseEntity.ok("Шағым жіберілді");
    }
}