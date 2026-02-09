package com.example.sixthproject.repository;

import com.example.sixthproject.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    // 1. Username (никнейм) бойынша іздеу ✅ (Енді User ішінде username бар, сондықтан істейді)
    List<Event> findByOrganizer_Username(String username);

    // 2. Іздеу (Search)
    List<Event> findByTitleContainingIgnoreCaseOrLocationContainingIgnoreCase(String title, String location);

    // 3. Категория бойынша (Filter)
    List<Event> findByCategory(String category);

    // 4. Менің посттарымды ID арқылы алу
    List<Event> findAllByOrganizerId(Long organizerId);
}