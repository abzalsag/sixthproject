package com.example.sixthproject.controller;

import com.example.sixthproject.dto.BuyTicketRequest;
import com.example.sixthproject.entity.Ticket;
import com.example.sixthproject.entity.User;
import com.example.sixthproject.repository.TicketRepository;
import com.example.sixthproject.repository.UserRepository;
import com.example.sixthproject.service.TicketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/events/tickets")
public class TicketController {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TicketService ticketService; // 🔥 ЖАҢА

    @PostMapping("/buy")
    public ResponseEntity<?> buyTicket(@RequestBody Map<String, Object> data, java.security.Principal principal) {
        try {
            Long eventId = Long.parseLong(String.valueOf(data.get("eventId")));
            // Principal арқылы ағымдағы пайдаланушыны аламыз (JWT-дан)
            String username = principal != null ? principal.getName() : (String) data.get("username");

            User user = userRepository.findByUsername(username)
                    .orElse(userRepository.findByEmail(username).orElse(null));

            if (user == null) {
                return ResponseEntity.status(404).body("Қате: Қолданушы табылмады.");
            }

            BuyTicketRequest request = new BuyTicketRequest();
            request.setUserId(user.getId());
            request.setEventId(eventId);

            String result = ticketService.buyTicket(request);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(400).body("Қате: " + e.getMessage());
        }
    }

    @GetMapping("/my")
    public ResponseEntity<List<Ticket>> getMyTickets(java.security.Principal principal) {
        String username = principal.getName();
        List<Ticket> tickets = ticketRepository.findByUser_Username(username);
        return ResponseEntity.ok(tickets);
    }

    // Билетті тексеру (QR код бойынша)
    @GetMapping("/verify/{qrCode}")
    public ResponseEntity<?> verifyTicket(@PathVariable String qrCode) {
        return ticketRepository.findByQrCode(qrCode)
                .map(ticket -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("valid", true);
                    response.put("eventTitle", ticket.getEvent().getTitle());
                    response.put("userName", ticket.getUser().getFirstname());
                    response.put("eventDate", ticket.getEvent().getEventDate());
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.status(404).body(Map.of("valid", false, "message", "Билет табылмады")));
    }

    // Билетті пайдаланылған деп белгілеу
    @PostMapping("/use/{qrCode}")
    public ResponseEntity<?> useTicket(@PathVariable String qrCode) {
        return ticketRepository.findByQrCode(qrCode)
                .map(ticket -> {
                    if (ticket.isUsed()) {
                        return ResponseEntity.status(400).body("Билет әлдеқашан пайдаланылған!");
                    }
                    ticket.setUsed(true);
                    ticket.setUsedAt(LocalDateTime.now());
                    ticketRepository.save(ticket);
                    return ResponseEntity.ok("Билет қабылданды ✅");
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // QR кодты тексеру
    @PostMapping("/validate/{qrCode}")
    public ResponseEntity<?> validateTicket(@PathVariable String qrCode) {
        Optional<Ticket> ticketOpt = ticketRepository.findByQrCode(qrCode);

        if (ticketOpt.isEmpty()) {
            return ResponseEntity.status(404).body(Map.of(
                    "valid", false,
                    "message", "Билет табылмады"
            ));
        }

        Ticket ticket = ticketOpt.get();

        if (ticket.isUsed()) {
            return ResponseEntity.status(400).body(Map.of(
                    "valid", false,
                    "message", "Билет қолданылған",
                    "usedAt", ticket.getUsedAt()
            ));
        }

        // Билетті қолданылған деп белгілеу
        ticket.setUsed(true);
        ticket.setUsedAt(LocalDateTime.now());
        ticketRepository.save(ticket);

        return ResponseEntity.ok(Map.of(
                "valid", true,
                "eventTitle", ticket.getEvent().getTitle(),
                "userName", ticket.getUser().getFirstname(),
                "eventDate", ticket.getEvent().getEventDate()
        ));
    }
}