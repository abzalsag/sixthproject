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