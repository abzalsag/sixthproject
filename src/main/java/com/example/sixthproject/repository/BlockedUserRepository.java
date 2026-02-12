package com.example.sixthproject.repository;

import com.example.sixthproject.entity.BlockedUser;
import com.example.sixthproject.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface BlockedUserRepository extends JpaRepository<BlockedUser, Long> {

    // Блоктаған ба екенін тексеру
    Optional<BlockedUser> findByBlockerAndBlocked(User blocker, User blocked);

    // Менің блоктаған адамдарым
    List<BlockedUser> findByBlocker(User blocker);

    // Мені блоктаған адамдар
    List<BlockedUser> findByBlocked(User blocked);

    // Екі адам арасында блок бар ма?
    @Query("SELECT CASE WHEN COUNT(b) > 0 THEN true ELSE false END FROM BlockedUser b " +
            "WHERE (b.blocker = :user1 AND b.blocked = :user2) OR " +
            "(b.blocker = :user2 AND b.blocked = :user1)")
    boolean existsBlockBetween(@Param("user1") User user1, @Param("user2") User user2);
}