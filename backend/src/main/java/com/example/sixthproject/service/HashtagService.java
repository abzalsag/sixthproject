package com.example.sixthproject.service;

import com.example.sixthproject.entity.Event;
import com.example.sixthproject.entity.Hashtag;
import com.example.sixthproject.repository.EventRepository;
import com.example.sixthproject.repository.HashtagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class HashtagService {

    private final HashtagRepository hashtagRepository;
    private final EventRepository eventRepository;

    // Мәтіннен хэштегтерді табу (#music, #party)
    public Set<Hashtag> extractHashtags(String text) {
        Set<Hashtag> hashtags = new HashSet<>();
        if (text == null) return hashtags;

        Pattern pattern = Pattern.compile("#(\\w+)");
        Matcher matcher = pattern.matcher(text);

        while (matcher.find()) {
            String tagName = matcher.group(1).toLowerCase();
            Hashtag hashtag = hashtagRepository.findByName(tagName)
                    .orElseGet(() -> {
                        Hashtag newTag = Hashtag.builder()
                                .name(tagName)
                                .usageCount(0)
                                .build();
                        return hashtagRepository.save(newTag);
                    });

            hashtag.setUsageCount(hashtag.getUsageCount() + 1);
            hashtagRepository.save(hashtag);
            hashtags.add(hashtag);
        }

        return hashtags;
    }

    // Trending хэштегтер
    public List<Hashtag> getTrending(int limit) {
        return hashtagRepository.findTrendingHashtags().stream()
                .limit(limit)
                .toList();
    }

    // Хэштег бойынша ивенттерді табу
    public List<Event> findEventsByHashtag(String tagName) {
        return hashtagRepository.findByName(tagName)
                .map(hashtag -> new ArrayList<>(hashtag.getEvents()))
                .orElse(new ArrayList<>());
    }
}