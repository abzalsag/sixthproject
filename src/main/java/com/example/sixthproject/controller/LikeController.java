package com.example.sixthproject.controller;


import com.example.sixthproject.entity.Event;
import com.example.sixthproject.entity.EventLike;
import com.example.sixthproject.entity.User;
import com.example.sixthproject.repository.EventRepository;
import com.example.sixthproject.repository.LikeRepository;
import com.example.sixthproject.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/likes")
public class LikeController {

    @Autowired
    private LikeRepository likeRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private EventRepository eventRepository;


    @PostMapping("/toggle")
    public String toggleLike(@RequestBody Map<String, String> data) {
        String username = data.get("username");
        Long eventId = Long.parseLong(String.valueOf(data.get("eventId")));

        User user = userRepository.findByEmail(username).orElse(null);
        Event event = eventRepository.findById(eventId).orElse(null);

        if (user != null && event != null) {

            if (likeRepository.existsByUserAndEvent(user, event)) {

                EventLike existingLike = likeRepository.findByUserAndEvent(user, event);
                likeRepository.delete(existingLike);
                return "UNLIKED";
            } else {

                EventLike newLike = EventLike.builder()
                        .user(user)
                        .event(event)
                        .build();
                likeRepository.save(newLike);
                return "LIKED";
            }
        }
        return "ERROR";
    }


    @GetMapping("/count/{eventId}")
    public long getLikeCount(@PathVariable Long eventId) {
        Event event = eventRepository.findById(eventId).orElse(null);
        if (event != null) {
            return likeRepository.countByEvent(event);
        }
        return 0;
    }


    @GetMapping("/check")
    public boolean checkLike(@RequestParam String username, @RequestParam Long eventId) {
        User user = userRepository.findByEmail(username).orElse(null);
        Event event = eventRepository.findById(eventId).orElse(null);
        if (user != null && event != null) {
            return likeRepository.existsByUserAndEvent(user, event);
        }
        return false;
    }
}