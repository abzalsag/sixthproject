package com.example.sixthproject.repository;

import com.example.sixthproject.entity.SavedEvent;
import com.example.sixthproject.entity.User;
import com.example.sixthproject.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface SavedEventRepository extends JpaRepository<SavedEvent, Long> {

    // Пайдаланушы мен ивент бойынша табу
    Optional<SavedEvent> findByUserAndEvent(User user, Event event);

    // Пайдаланушының барлық сақталған ивенттері
    List<SavedEvent> findByUser(User user);

    // Ивентті қанша адам сақтаған
    long countByEvent(Event event);
}