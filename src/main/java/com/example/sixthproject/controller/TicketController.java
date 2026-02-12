package com.example.sixthproject.controller;

import com.example.sixthproject.dto.BuyTicketRequest;
import com.example.sixthproject.entity.Ticket;
import com.example.sixthproject.entity.User;
import com.example.sixthproject.repository.TicketRepository;
import com.example.sixthproject.repository.UserRepository;
import com.example.sixthproject.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TicketService ticketService; // 🔥 ЖАҢА

    @PostMapping("/buy")
    public String buyTicket(@RequestBody Map<String, Object> data) {
        String username = (String) data.get("username");
        Long eventId = Long.parseLong(String.valueOf(data.get("eventId")));

        User user = userRepository.findByEmail(username).orElse(null);

        if (user != null) {
            BuyTicketRequest request = new BuyTicketRequest();
            request.setUserId(user.getId());
            request.setEventId(eventId);

            return ticketService.buyTicket(request); // 🔥 Service қолдану
        }
        return "Қате: Қолданушы табылмады.";
    }

    @GetMapping("/my-tickets/{username}")
    public List<Ticket> getMyTickets(@PathVariable String username) {
        return ticketRepository.findByUser_Username(username);
    }
}