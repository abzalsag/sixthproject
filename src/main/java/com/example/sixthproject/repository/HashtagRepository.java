package com.example.sixthproject.repository;

import com.example.sixthproject.entity.Hashtag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface HashtagRepository extends JpaRepository<Hashtag, Long> {
    Optional<Hashtag> findByName(String name);

    // Trending хэштегтер (көп қолданылғандар)
    @Query("SELECT h FROM Hashtag h ORDER BY h.usageCount DESC")
    List<Hashtag> findTrendingHashtags();

    // Хэштег бойынша іздеу
    @Query("SELECT h FROM Hashtag h WHERE LOWER(h.name) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Hashtag> searchHashtags(@org.springframework.data.repository.query.Param("query") String query);
}