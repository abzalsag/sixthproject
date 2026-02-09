package com.example.sixthproject.repository;


import com.example.sixthproject.entity.EventLike;
import com.example.sixthproject.entity.User;
import com.example.sixthproject.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LikeRepository extends JpaRepository<EventLike, Long> {
    // 1. Тусовканың лайк санын санау
    long countByEvent(Event event);

    // 2. Адамның лайк басқанын тексеру
    boolean existsByUserAndEvent(User user, Event event);

    // 3. Лайкты алып тастау үшін табу
    EventLike findByUserAndEvent(User user, Event event);
}