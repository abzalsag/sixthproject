package com.example.sixthproject.config;

import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * RateLimitFilter — IP-бойынша минутына 500 сұранысқа дейін рұқсат береді.
 * 60 секунд өткен соң счётшік тазаланады.
 */
@Component
public class RateLimitFilter implements Filter {

    private static final int MAX_REQUESTS_PER_MINUTE = 500;
    private static final long WINDOW_MS = 60_000; // 1 минут

    private final ConcurrentHashMap<String, long[]> requestWindows = new ConcurrentHashMap<>();

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        String clientIP = httpRequest.getRemoteAddr();
        long now = System.currentTimeMillis();

        // [count, windowStart]
        long[] window = requestWindows.computeIfAbsent(clientIP, k -> new long[]{0, now});

        synchronized (window) {
            // Уақыт терезесі өтсе — тастаймыз
            if (now - window[1] > WINDOW_MS) {
                window[0] = 0;
                window[1] = now;
            }
            window[0]++;

            if (window[0] > MAX_REQUESTS_PER_MINUTE) {
                HttpServletResponse httpResponse = (HttpServletResponse) response;
                httpResponse.setStatus(429);
                httpResponse.setContentType("application/json");
                httpResponse.getWriter().write("{\"error\":\"Too many requests. Try again in a minute.\"}");
                return;
            }
        }

        chain.doFilter(request, response);
    }
}