package com.example.sixthproject.controller;

import com.example.sixthproject.entity.Event;
import com.example.sixthproject.entity.SavedEvent;
import com.example.sixthproject.entity.User;
import com.example.sixthproject.repository.EventRepository;
import com.example.sixthproject.repository.SavedEventRepository;
import com.example.sixthproject.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/saved")
@RequiredArgsConstructor
public class SavedEventController {

    private final SavedEventRepository savedEventRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    // Сақтау/Алып тастау
    @PostMapping("/event/{eventId}")
    public ResponseEntity<?> toggleSave(@PathVariable Long eventId, Principal principal) {
        User user = userRepository.findByUsername(principal.getName()).orElseThrow();
        Event event = eventRepository.findById(eventId).orElseThrow();

        Optional<SavedEvent> existing = savedEventRepository.findByUserAndEvent(user, event);

        if (existing.isPresent()) {
            savedEventRepository.delete(existing.get());
            return ResponseEntity.ok("Алып тасталды");
        } else {
            SavedEvent saved = SavedEvent.builder()
                    .user(user)
                    .event(event)
                    .build();
            savedEventRepository.save(saved);
            return ResponseEntity.ok("Сақталды ✅");
        }
    }

    // Менің сақталған ивенттерім
    @GetMapping("/my")
    public ResponseEntity<List<Event>> getMySavedEvents(Principal principal) {
        User user = userRepository.findByUsername(principal.getName()).orElseThrow();
        List<SavedEvent> saved = savedEventRepository.findByUser(user);
        List<Event> events = saved.stream()
                .map(SavedEvent::getEvent)
                .collect(Collectors.toList());
        return ResponseEntity.ok(events);
    }
}
