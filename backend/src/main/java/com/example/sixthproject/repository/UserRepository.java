package com.example.sixthproject.repository;

import com.example.sixthproject.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);


    @Query("SELECT u FROM User u WHERE " +
            "LOWER(u.username) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(u.firstname) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(u.lastname) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
            "LOWER(u.email) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<User> searchUsers(@Param("query") String query);


    @Query("SELECT u FROM User u JOIN u.following f WHERE f.id = :id")
    List<User> findByFollowingId(@Param("id") Long id);


    @Query("SELECT f FROM User u JOIN u.following f WHERE u.id = :id")
    List<User> findByFollowersId(@Param("id") Long id);
}