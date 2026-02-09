package com.example.sixthproject.service;


import com.example.sixthproject.dto.BuyTicketRequest;
import com.example.sixthproject.entity.Event;
import com.example.sixthproject.entity.Ticket;
import com.example.sixthproject.entity.User;
import com.example.sixthproject.repository.EventRepository;
import com.example.sixthproject.repository.TicketRepository;
import com.example.sixthproject.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID; // QR код үшін кездейсоқ сандар

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;

    public String buyTicket(BuyTicketRequest request) {
        // 1. Адамды табамыз
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("Адам табылмады!"));

        // 2. Концертті табамыз
        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new RuntimeException("Іс-шара табылмады!"));

        // 3. Билет қалды ма? Тексереміз
        if (event.getTotalTickets() <= 0) {
            return "Өкінішке орай, билеттер таусылды!";
        }

        // 4. Билет санын азайтамыз (1000 -> 999)
        event.setTotalTickets(event.getTotalTickets() - 1);
        eventRepository.save(event); // Өзгерісті сақтаймыз

        // 5. Жаңа билет жазып береміз
        Ticket ticket = Ticket.builder()
                .user(user)
                .event(event)
                .boughtAt(LocalDateTime.now())
                .qrCode(UUID.randomUUID().toString()) // Уақытша QR орнына ұзын код береміз
                .status("BOUGHT") // Статусы: Сатып алынды
                .build();

        ticketRepository.save(ticket);

        return "Билет сәтті сатып алынды! Сіздің QR кодыңыз: " + ticket.getQrCode();
    }
}
