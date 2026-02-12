package com.example.sixthproject.repository;

import com.example.sixthproject.entity.Ticket;
import com.example.sixthproject.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket, Long> {


    Ticket findByQrCode(String qrCode);
    List<Ticket> findByUser(User user);

    List<Ticket> findByUser_Username(String username);
}