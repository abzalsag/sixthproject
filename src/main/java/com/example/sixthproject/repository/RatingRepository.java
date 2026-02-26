package com.example.sixthproject.repository;

import com.example.sixthproject.entity.Event;
import com.example.sixthproject.entity.Rating;
import com.example.sixthproject.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {

    Optional<Rating> findByUserAndEvent(User user, Event event);

    List<Rating> findByEvent(Event event);

    List<Rating> findByUser(User user);

    boolean existsByUserAndEvent(User user, Event event);
}