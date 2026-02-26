package com.example.sixthproject.repository;

import com.example.sixthproject.entity.Story;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface StoryRepository extends JpaRepository<Story, Long> {


    List<Story> findByExpiresAtAfter(LocalDateTime now);


    List<Story> findByUserIdAndExpiresAtAfter(Long userId, LocalDateTime now);
}