package com.example.sixthproject.controller;



import com.example.sixthproject.dto.FollowRequest;
import com.example.sixthproject.service.FollowService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/follows")
@RequiredArgsConstructor
public class FollowController {

    private final FollowService followService;


    @PostMapping
    public String follow(@RequestBody FollowRequest request) {
        return followService.followUser(request);
    }
}
