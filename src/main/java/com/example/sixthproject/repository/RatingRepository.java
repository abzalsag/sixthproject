package com.example.sixthproject.repository;

import com.example.sixthproject.entity.Rating;
import com.example.sixthproject.entity.User;
import com.example.sixthproject.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface RatingRepository extends JpaRepository<Rating, Long> {

    // 🔥 ТҮЗЕТУ: findByUserAndEvent орнына findByEventAndUser
    Optional<Rating> findByEventAndUser(Event event, User user);

    // Ивенттің барлық рейтингтері
    List<Rating> findByEvent(Event event);

    // Пайдаланушының барлық рейтингтері
    List<Rating> findByUser(User user);

    // Ивенттің орташа рейтингі
    @org.springframework.data.jpa.repository.Query("SELECT AVG(r.stars) FROM Rating r WHERE r.event = :event")
    Double getAverageRating(@org.springframework.data.repository.query.Param("event") Event event);
}