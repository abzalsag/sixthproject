package com.example.sixthproject.service;


import com.example.sixthproject.dto.EventRequest;
import com.example.sixthproject.entity.Event;
import com.example.sixthproject.entity.User;
import com.example.sixthproject.repository.EventRepository;
import com.example.sixthproject.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    // 1. Іс-шара құру
    public String createEvent(EventRequest request) {
        // Алдымен ұйымдастырушыны табамыз
        User organizer = userRepository.findById(request.getOrganizerId())
                .orElseThrow(() -> new RuntimeException("Ұйымдастырушы табылмады!"));

        // Event-ті құрастыру
        Event newEvent = Event.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .location(request.getLocation())
                .eventDate(request.getEventDate())
                .price(request.getPrice())
                .totalTickets(request.getTotalTickets())
                .organizer(organizer) // Байланыс орнату
                .build();

        eventRepository.save(newEvent);
        return "Іс-шара сәтті сақталды!";
    }

    // 2. Барлық іс-шараларды алу
    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }
}