package com.example.sixthproject.controller;





import com.example.sixthproject.entity.Event;
import com.example.sixthproject.entity.Ticket;
import com.example.sixthproject.entity.User;
import com.example.sixthproject.repository.EventRepository;
import com.example.sixthproject.repository.TicketRepository;
import com.example.sixthproject.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EventRepository eventRepository;

    @PostMapping("/buy")
    public String buyTicket(@RequestBody Map<String, Object> data) {
        String username = (String) data.get("username");
        Long eventId = Long.parseLong(String.valueOf(data.get("eventId")));

        User user = userRepository.findByEmail(username).orElse(null);
        Event event = eventRepository.findById(eventId).orElse(null);

        if (user != null && event != null) {
            // 🔥 ТЕКСЕРУ: Билет қалды ма?
            if (event.getTotalTickets() <= 0) {
                return "Өкінішке орай, билеттер таусылды! (SOLD OUT)";
            }

            // 1. Билет жасаймыз
            Ticket ticket = new Ticket();
            ticket.setUser(user);
            ticket.setEvent(event);
            ticket.setQrCode(UUID.randomUUID().toString());
            ticketRepository.save(ticket);

            // 2. Билет санын азайтамыз
            event.setTotalTickets(event.getTotalTickets() - 1);
            eventRepository.save(event); // Жаңартылған санды сақтаймыз

            return "Билет сәтті алынды! QR код профильде.";
        }
        return "Қате: Қолданушы немесе Тусовка табылмады.";
    }

    @GetMapping("/my-tickets/{username}")
    public List<Ticket> getMyTickets(@PathVariable String username) {
        return ticketRepository.findByUser_Username(username);
    }
}