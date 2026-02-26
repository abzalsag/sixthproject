package com.example.sixthproject.service;

import com.example.sixthproject.entity.BlockedUser;
import com.example.sixthproject.entity.User;
import com.example.sixthproject.repository.BlockedUserRepository;
import com.example.sixthproject.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BlockService {

    private final BlockedUserRepository blockedUserRepository;
    private final UserRepository userRepository;

    // Пайдаланушыны блоктау
    public String blockUser(User blocker, Long blockedUserId) {
        User blocked = userRepository.findById(blockedUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Өзін өзі блоктауға болмайды
        if (blocker.getId().equals(blocked.getId())) {
            throw new RuntimeException("Өзіңізді блоктай алмайсыз");
        }

        // Бұрын блокталған ба?
        if (blockedUserRepository.findByBlockerAndBlocked(blocker, blocked).isPresent()) {
            throw new RuntimeException("Бұл адам әлдеқашан блокталған");
        }

        // Блоктау
        BlockedUser block = BlockedUser.builder()
                .blocker(blocker)
                .blocked(blocked)
                .build();
        blockedUserRepository.save(block);

        // Егер жазылған болса, жазылымды алып тастау
        if (blocker.getFollowing() != null && blocker.getFollowing().contains(blocked)) {
            blocker.getFollowing().remove(blocked);
            userRepository.save(blocker);
        }

        return "Пайдаланушы блокталды";
    }

    // Блокты алып тастау
    public String unblockUser(User blocker, Long blockedUserId) {
        User blocked = userRepository.findById(blockedUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        BlockedUser block = blockedUserRepository.findByBlockerAndBlocked(blocker, blocked)
                .orElseThrow(() -> new RuntimeException("Блок табылмады"));

        blockedUserRepository.delete(block);
        return "Блок алынды";
    }

    // Блокталған ба екенін тексеру
    public boolean isBlocked(User user1, User user2) {
        return blockedUserRepository.existsBlockBetween(user1, user2);
    }
}