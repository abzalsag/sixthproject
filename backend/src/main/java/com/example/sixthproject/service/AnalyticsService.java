package com.example.sixthproject.service;

import com.example.sixthproject.entity.*;
import com.example.sixthproject.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AnalyticsService {

    private final EventRepository eventRepository;
    private final EventAnalyticsRepository analyticsRepository;

    // Ивент көрілді
    public void trackView(Long eventId) {
        eventRepository.findById(eventId).ifPresent(event -> {
            if (event.getAnalytics() == null) {
                EventAnalytics analytics = EventAnalytics.builder()
                        .event(event)
                        .views(1)
                        .shares(0)
                        .ticketsSold(0)
                        .revenue(0.0)
                        .build();
                event.setAnalytics(analytics);
            } else {
                event.getAnalytics().setViews(
                        event.getAnalytics().getViews() + 1
                );
            }
            eventRepository.save(event);
        });
    }

    // Билет сатылды
    public void trackTicketSale(Long eventId, Double price) {
        eventRepository.findById(eventId).ifPresent(event -> {
            if (event.getAnalytics() == null) {
                EventAnalytics analytics = EventAnalytics.builder()
                        .event(event)
                        .views(0)
                        .shares(0)
                        .ticketsSold(1)
                        .revenue(price)
                        .build();
                event.setAnalytics(analytics);
            } else {
                EventAnalytics analytics = event.getAnalytics();
                analytics.setTicketsSold(analytics.getTicketsSold() + 1);
                analytics.setRevenue(analytics.getRevenue() + price);
            }
            eventRepository.save(event);
        });
    }

    // Share санын арттыру
    public void trackShare(Long eventId) {
        eventRepository.findById(eventId).ifPresent(event -> {
            if (event.getAnalytics() == null) {
                EventAnalytics analytics = EventAnalytics.builder()
                        .event(event)
                        .views(0)
                        .shares(1)
                        .ticketsSold(0)
                        .revenue(0.0)
                        .build();
                event.setAnalytics(analytics);
            } else {
                event.getAnalytics().setShares(
                        event.getAnalytics().getShares() + 1
                );
            }
            eventRepository.save(event);
        });
    }
}