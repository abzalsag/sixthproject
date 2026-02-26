package com.example.sixthproject.controller;

import com.example.sixthproject.entity.User;
import com.example.sixthproject.repository.UserRepository;
import com.example.sixthproject.service.BlockService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class BlockController {

    private final BlockService blockService;
    private final UserRepository userRepository;

    // Пайдаланушыны блоктау
    @PostMapping("/{id}/block")
    public ResponseEntity<?> blockUser(@PathVariable Long id, Principal principal) {
        User currentUser = userRepository.findByUsername(principal.getName()).orElseThrow();
        String result = blockService.blockUser(currentUser, id);
        return ResponseEntity.ok(result);
    }

    // Блокты алып тастау
    @DeleteMapping("/{id}/block")
    public ResponseEntity<?> unblockUser(@PathVariable Long id, Principal principal) {
        User currentUser = userRepository.findByUsername(principal.getName()).orElseThrow();
        String result = blockService.unblockUser(currentUser, id);
        return ResponseEntity.ok(result);
    }
}