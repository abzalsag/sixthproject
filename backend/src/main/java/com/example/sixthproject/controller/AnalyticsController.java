package com.example.sixthproject.controller;

import com.example.sixthproject.entity.EventAnalytics;
import com.example.sixthproject.repository.EventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final EventRepository eventRepository;

    // Ивент статистикасын алу
    @GetMapping("/event/{eventId}")
    public ResponseEntity<EventAnalytics> getEventAnalytics(@PathVariable Long eventId) {
        return eventRepository.findById(eventId)
                .map(event -> ResponseEntity.ok(event.getAnalytics()))
                .orElse(ResponseEntity.notFound().build());
    }
}