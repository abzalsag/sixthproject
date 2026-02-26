package com.example.sixthproject.service;

import com.example.sixthproject.dto.EventRequest;
import com.example.sixthproject.entity.Chat;
import com.example.sixthproject.entity.Event;
import com.example.sixthproject.entity.User;
import com.example.sixthproject.repository.ChatRepository;
import com.example.sixthproject.repository.EventRepository;
import com.example.sixthproject.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;

@Service
@RequiredArgsConstructor
public class EventService {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final ChatRepository chatRepository;

    @Transactional
    public String createEvent(EventRequest request) {
        User organizer = userRepository.findById(request.getOrganizerId())
                .orElseThrow(() -> new RuntimeException("Ұйымдастырушы табылмады!"));

        // 🔥 Чат құру
        Chat eventChat = Chat.builder()
                .chatName("Event Chat: " + request.getTitle())
                .isGroupChat(true)
                .participants(new HashSet<>())
                .createdAt(LocalDateTime.now())
                .build();

        eventChat.getParticipants().add(organizer);
        chatRepository.save(eventChat);

        Event newEvent = Event.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .location(request.getLocation())
                .eventDate(request.getEventDate())
                .price(request.getPrice())
                .totalTickets(request.getTotalTickets())
                .organizer(organizer)
                .chat(eventChat)
                .build();

        eventRepository.save(newEvent);
        return "Іс-шара сәтті сақталды! Чат құрылды.";
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }
}
