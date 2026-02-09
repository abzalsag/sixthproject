package com.example.sixthproject;



import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;


@SpringBootApplication
@EnableCaching

public class SixthProjectApplication {

    public static void main(String[] args) {
        SpringApplication.run(SixthProjectApplication.class, args);
    }

}