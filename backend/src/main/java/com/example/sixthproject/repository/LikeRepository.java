package com.example.sixthproject.repository;


import com.example.sixthproject.entity.EventLike;
import com.example.sixthproject.entity.User;
import com.example.sixthproject.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LikeRepository extends JpaRepository<EventLike, Long> {

    long countByEvent(Event event);


    boolean existsByUserAndEvent(User user, Event event);


    EventLike findByUserAndEvent(User user, Event event);
}