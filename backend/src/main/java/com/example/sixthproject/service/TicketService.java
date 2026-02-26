package com.example.sixthproject.service;

import com.example.sixthproject.dto.BuyTicketRequest;
import com.example.sixthproject.entity.Chat;
import com.example.sixthproject.entity.Event;
import com.example.sixthproject.entity.Ticket;
import com.example.sixthproject.entity.User;
import com.example.sixthproject.repository.ChatRepository;
import com.example.sixthproject.repository.EventRepository;
import com.example.sixthproject.repository.TicketRepository;
import com.example.sixthproject.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TicketService {

    private final TicketRepository ticketRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final ChatRepository chatRepository;

    @Transactional
    public String buyTicket(BuyTicketRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("Адам табылмады!"));

        Event event = eventRepository.findById(request.getEventId())
                .orElseThrow(() -> new RuntimeException("Іс-шара табылмады!"));

        if (event.getTotalTickets() <= 0) {
            return "Өкінішке орай, билеттер таусылды!";
        }

        event.setTotalTickets(event.getTotalTickets() - 1);
        eventRepository.save(event);

        Ticket ticket = Ticket.builder()
                .user(user)
                .event(event)
                .boughtAt(LocalDateTime.now())
                .qrCode(UUID.randomUUID().toString())
                .status("BOUGHT")
                .build();

        ticketRepository.save(ticket);

        // 🔥 Чатқа қосу
        if (event.getChat() != null) {
            Chat eventChat = event.getChat();
            eventChat.getParticipants().add(user);
            chatRepository.save(eventChat);
        }

        return "Билет сәтті алынды! Чатқа қосылдыңыз. QR: " + ticket.getQrCode();
    }


    @Transactional
    public String refundTicket(Long ticketId, Long userId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new RuntimeException("Билет табылмады!"));

        if (!ticket.getUser().getId().equals(userId)) {
            return "Бұл сіздің билетіңіз емес!";
        }

        if (ticket.isUsed()) {
            return "Пайдаланылған билетті қайтаруға болмайды!";
        }

        Event event = ticket.getEvent();

        // Ивент басталуға 24 сағаттан кем қалса, қайтаруға болмайды
        if (event.getEventDate().isBefore(LocalDateTime.now().plusHours(24))) {
            return "Ивент басталуға 24 сағаттан кем қалды, қайтаруға болмайды!";
        }

        // Билет санын қайтару
        event.setTotalTickets(event.getTotalTickets() + 1);
        eventRepository.save(event);

        // Чаттан шығару
        if (event.getChat() != null) {
            Chat eventChat = event.getChat();
            eventChat.getParticipants().remove(ticket.getUser());
            chatRepository.save(eventChat);
        }

        // Билетті өшіру
        ticketRepository.delete(ticket);

        return "Билет сәтті қайтарылды! Ақша 3-5 жұмыс күні ішінде қайтарылады.";
    }
}