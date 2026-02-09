package com.example.sixthproject.repository;

import com.example.sixthproject.entity.Ticket;
import com.example.sixthproject.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    // 1. QR код арқылы іздеу (Болашақта есікте тексеру үшін)
    Ticket findByQrCode(String qrCode);

    // 2. Адам арқылы билеттерін табу (My Tickets беті үшін)
    List<Ticket> findByUser(User user);

    List<Ticket> findByUser_Username(String username);
}