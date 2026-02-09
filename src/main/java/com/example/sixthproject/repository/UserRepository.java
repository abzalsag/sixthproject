package com.example.sixthproject.repository;

import com.example.sixthproject.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    // 🔥 КҮШЕЙТІЛГЕН ІЗДЕУ (БҰЛ ЕҢ МЫҚТЫ ТӘСІЛ)
    // Бұл код сенің жазғаныңды кіші әріпке айналдырып, Атынан да, Тегінен де, Поштасынан да іздейді.
    @Query("SELECT u FROM User u WHERE " +
            "LOWER(u.firstname) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(u.lastname) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(u.email) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<User> searchUsers(@Param("query") String query);

    // Бұрынғы ұзын аты бар функцияны осыған ауыстырдық.
    // Егер Controller-де қызарып тұрса, оны төменде түзетеміз.

    @Query("SELECT u FROM User u JOIN u.following f WHERE f.id = :id")
    List<User> findByFollowingId(@Param("id") Long id);

    @Query("SELECT u FROM User u JOIN u.followers f WHERE f.id = :id")
    List<User> findByFollowersId(@Param("id") Long id);

    Optional<User> findByUsername(String username);
}