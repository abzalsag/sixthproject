package com.example.sixthproject.repository;

import com.example.sixthproject.entity.EventAnalytics;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventAnalyticsRepository extends JpaRepository<EventAnalytics, Long> {
}