package com.example.sixthproject.repository;

import com.example.sixthproject.entity.Ticket;
import com.example.sixthproject.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface TicketRepository extends JpaRepository<Ticket, Long> {

    // 🔥 ТҮЗЕТУ: Optional<Ticket> қайтару керек
    Optional<Ticket> findByQrCode(String qrCode);

    List<Ticket> findByUser(User user);

    List<Ticket> findByUser_Username(String username);
}