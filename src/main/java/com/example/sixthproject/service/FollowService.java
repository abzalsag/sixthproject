package com.example.sixthproject.service;


import com.example.sixthproject.dto.FollowRequest;
import com.example.sixthproject.entity.Follow;
import com.example.sixthproject.entity.User;
import com.example.sixthproject.repository.FollowRepository;
import com.example.sixthproject.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class FollowService {

    private final FollowRepository followRepository;
    private final UserRepository userRepository;

    public String followUser(FollowRequest request) {
        // 1. Жазылғысы келетін адамды табамыз (Мен)
        User follower = userRepository.findById(request.getFollowerId())
                .orElseThrow(() -> new RuntimeException("Жазылушы табылмады"));

        // 2. Кімге жазылатынын табамыз (Сен)
        User following = userRepository.findById(request.getFollowingId())
                .orElseThrow(() -> new RuntimeException("Адам табылмады"));

        // 3. Өзіне өзі жазылуға болмайды
        if (follower.getId().equals(following.getId())) {
            return "Қате: Өзіңізге өзіңіз жазыла алмайсыз!";
        }

        // 4. Жазылымды сақтаймыз
        Follow follow = new Follow();
        follow.setFollower(follower);
        follow.setFollowing(following);

        followRepository.save(follow);

        return "Сіз " + following.getUsername() + " атты қолданушыға жазылдыңыз!";
    }
}
