package com.example.sixthproject.service;

import com.example.sixthproject.entity.User;
import com.example.sixthproject.repository.BlockedUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PrivacyService {

    private final BlockedUserRepository blockedUserRepository;

    // Профильді көре ала ма?
    public boolean canViewProfile(User viewer, User profileOwner) {
        // Өзінің профилі
        if (viewer.getId().equals(profileOwner.getId())) {
            return true;
        }

        // Блокталған ба?
        if (blockedUserRepository.existsBlockBetween(viewer, profileOwner)) {
            return false;
        }

        // Жабық профиль емес
        if (!profileOwner.isPrivate()) {
            return true;
        }

        // Жабық профиль, бірақ жазылушы
        return profileOwner.getFollowers() != null &&
                profileOwner.getFollowers().contains(viewer);
    }

    // Хабарлама жібере ала ма?
    public boolean canSendMessage(User sender, User receiver) {
        // Блокталған ба?
        if (blockedUserRepository.existsBlockBetween(sender, receiver)) {
            return false;
        }

        // Жабық профиль емес
        if (!receiver.isPrivate()) {
            return true;
        }

        // Жабық профиль, бірақ жазылушы
        return receiver.getFollowers() != null &&
                receiver.getFollowers().contains(sender);
    }
}