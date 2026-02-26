package com.example.sixthproject.repository;

import com.example.sixthproject.entity.PushToken;
import com.example.sixthproject.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface PushTokenRepository extends JpaRepository<PushToken, Long> {
    List<PushToken> findByUser(User user);
    Optional<PushToken> findByFcmToken(String fcmToken);
}