package com.example.sixthproject.controller;

import com.example.sixthproject.entity.Event;
import com.example.sixthproject.entity.Hashtag;
import com.example.sixthproject.service.HashtagService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/hashtags")
@RequiredArgsConstructor
public class HashtagController {

    private final HashtagService hashtagService;

    // Trending хэштегтер
    @GetMapping("/trending")
    public ResponseEntity<List<Hashtag>> getTrending() {
        return ResponseEntity.ok(hashtagService.getTrending(20));
    }

    // Хэштег бойынша ивенттер
    @GetMapping("/{tagName}/events")
    public ResponseEntity<List<Event>> getEventsByHashtag(@PathVariable String tagName) {
        return ResponseEntity.ok(hashtagService.findEventsByHashtag(tagName));
    }
}