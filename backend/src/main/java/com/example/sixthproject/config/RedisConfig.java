package com.example.sixthproject.config;

import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.concurrent.ConcurrentMapCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

/**
 * RedisConfig — Redis жоқ болса қарапайым in-memory cache қолданылады.
 * Redis қосылған жағдайда: spring.data.redis.host конфигурациясы арқылы байланысады.
 */
@Configuration
@EnableCaching
public class RedisConfig {

    /**
     * Redis жоқ болса — ConcurrentMapCacheManager (in-memory) қолданылады.
     * Серверді өшіргенде cache жоғалады, бірақ жұмыс жасайды.
     */
    @Bean
    @Primary
    public CacheManager cacheManager() {
        return new ConcurrentMapCacheManager("events", "posts", "users", "stories");
    }
}