package com.example.sixthproject.repository;

import com.example.sixthproject.entity.Event;
import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {


    List<Event> findByOrganizer_Username(String username);


    List<Event> findByTitleContainingIgnoreCaseOrLocationContainingIgnoreCase(String title, String location);


    List<Event> findByCategory(String category);


    List<Event> findAllByOrganizerId(Long organizerId);

    @Query("SELECT DISTINCT e FROM Event e LEFT JOIN e.hashtags h WHERE " +
            "LOWER(e.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.location) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(e.description) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(h.name) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Event> advancedSearch(@Param("query") String query);
}