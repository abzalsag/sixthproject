package com.example.sixthproject.repository;

import com.example.sixthproject.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {


    List<Event> findByOrganizer_Username(String username);


    List<Event> findByTitleContainingIgnoreCaseOrLocationContainingIgnoreCase(String title, String location);


    List<Event> findByCategory(String category);


    List<Event> findAllByOrganizerId(Long organizerId);
}