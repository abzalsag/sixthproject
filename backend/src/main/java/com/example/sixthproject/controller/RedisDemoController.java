package com.example.sixthproject.controller;

import org.springframework.cache.annotation.Cacheable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/redis")
public class RedisDemoController {


    @GetMapping("/slow-data")
    @Cacheable(value = "myData")
    public String getSlowData() throws InterruptedException {

        Thread.sleep(3000);
        return "Бұл мәлімет базадан әзер келді! (Уақыт: " + System.currentTimeMillis() + ")";
    }
}