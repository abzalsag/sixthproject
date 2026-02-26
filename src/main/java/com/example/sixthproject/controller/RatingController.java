package com.example.sixthproject.controller;

import com.example.sixthproject.entity.Event;
import com.example.sixthproject.entity.Rating;
import com.example.sixthproject.entity.User;
import com.example.sixthproject.repository.EventRepository;
import com.example.sixthproject.repository.RatingRepository;
import com.example.sixthproject.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;



    @RestController
    @RequestMapping("/api/ratings")
    @RequiredArgsConstructor
    public class RatingController {

        private final RatingRepository ratingRepository;
        private final EventRepository eventRepository;
        private final UserRepository userRepository;

        // Бағалау қалдыру
        @PostMapping("/event/{eventId}")
        public ResponseEntity<?> rateEvent(
                @PathVariable Long eventId,
                @RequestBody Map<String, Object> request,
                Principal principal
        ) {
            User user = userRepository.findByUsername(principal.getName()).orElseThrow();
            Event event = eventRepository.findById(eventId).orElseThrow();

            // Бұрын бағалаған ба?
            Optional<Rating> existing = ratingRepository.findByUserAndEvent(user, event);
            if (existing.isPresent()) {
                return ResponseEntity.status(400).body("Сіз бұл ивентті әлдеқашан бағаладыңыз");
            }

            Rating rating = Rating.builder()
                    .event(event)
                    .user(user)
                    .rating((Integer) request.get("stars"))
                    .review((String) request.get("review"))
                    .build();

            ratingRepository.save(rating);

            // Орташа рейтингті есептеу
            updateEventRating(event);

            return ResponseEntity.ok("Рахмет! 🌟");
        }

        // Ивенттің орташа рейтингі
        @GetMapping("/event/{eventId}/average")
        public ResponseEntity<Map<String, Object>> getAverageRating(@PathVariable Long eventId) {
            Event event = eventRepository.findById(eventId).orElseThrow();
            List<Rating> ratings = ratingRepository.findByEvent(event);

            double average = ratings.stream()
                    .mapToInt(Rating::getRating)
                    .average()
                    .orElse(0.0);

            Map<String, Object> response = new HashMap<>();
            response.put("average", Math.round(average * 10) / 10.0);
            response.put("count", ratings.size());

            return ResponseEntity.ok(response);
        }

        private void updateEventRating(Event event) {
            List<Rating> ratings = ratingRepository.findByEvent(event);
            double avg = ratings.stream().mapToInt(Rating::getRating).average().orElse(0.0);
            event.setAverageRating(avg);
            eventRepository.save(event);
        }
    }

