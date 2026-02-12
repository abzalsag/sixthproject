package com.example.sixthproject.service;

import com.example.sixthproject.entity.*;
import com.example.sixthproject.repository.*;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.model.Refund;
import com.stripe.net.RequestOptions;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.param.RefundCreateParams;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class StripePaymentService {

    private final PaymentRepository paymentRepository;
    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final TicketRepository ticketRepository;

    @Value("${stripe.api.key}")
    private String stripeApiKey;

    @Value("${stripe.currency:KZT}")
    private String currency;

    // Payment Intent құру
    @Transactional
    public Map<String, String> createPaymentIntent(Long eventId, String username) throws StripeException {
        Stripe.apiKey = stripeApiKey;

        // Event және User алу
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new RuntimeException("Event not found"));
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Билет қалды ма тексеру
        if (event.getTotalTickets() <= 0) {
            throw new RuntimeException("Билеттер таусылды!");
        }

        // Stripe-қа жіберу үшін сомманы тиынға айналдыру (KZT)
        long amountInTiyn = event.getPrice().multiply(new BigDecimal(100)).longValue();

        // Payment Intent құру
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(amountInTiyn)
                .setCurrency(currency.toLowerCase())
                .putMetadata("eventId", eventId.toString())
                .putMetadata("userId", user.getId().toString())
                .putMetadata("eventTitle", event.getTitle())
                .setAutomaticPaymentMethods(
                        PaymentIntentCreateParams.AutomaticPaymentMethods.builder()
                                .setEnabled(true)
                                .build()
                )
                .build();

        PaymentIntent paymentIntent = PaymentIntent.create(params);

        // Payment entity сақтау
        Payment payment = Payment.builder()
                .user(user)
                .event(event)
                .stripePaymentIntentId(paymentIntent.getId())
                .amount(event.getPrice())
                .currency(currency)
                .status(PaymentStatus.PENDING)
                .build();

        paymentRepository.save(payment);

        // Client Secret қайтару
        Map<String, String> response = new HashMap<>();
        response.put("clientSecret", paymentIntent.getClientSecret());
        response.put("paymentIntentId", paymentIntent.getId());

        return response;
    }

    // Төлем сәтті өткенде билет құру
    @Transactional
    public Ticket confirmPayment(String paymentIntentId) {
        Payment payment = paymentRepository.findByStripePaymentIntentId(paymentIntentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        // Төлем статусын жаңарту
        payment.setStatus(PaymentStatus.SUCCEEDED);
        payment.setCompletedAt(LocalDateTime.now());
        paymentRepository.save(payment);

        // Билет құру
        Ticket ticket = Ticket.builder()
                .user(payment.getUser())
                .event(payment.getEvent())
                .build();

        Ticket savedTicket = ticketRepository.save(ticket);

        // Payment-ке ticket байлау
        payment.setTicket(savedTicket);
        paymentRepository.save(payment);

        // Билет санын азайту
        Event event = payment.getEvent();
        event.setTotalTickets(event.getTotalTickets() - 1);
        eventRepository.save(event);

        return savedTicket;
    }

    // Төлем қатесі
    @Transactional
    public void handlePaymentFailure(String paymentIntentId, String reason) {
        Payment payment = paymentRepository.findByStripePaymentIntentId(paymentIntentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        payment.setStatus(PaymentStatus.FAILED);
        payment.setFailureReason(reason);
        paymentRepository.save(payment);
    }

    // PaymentService.java-ға қосу



    // Төлем сәтті өткен кезде билет жасау
    @Transactional
    public void handlePaymentSuccess(String paymentIntentId) {
        Payment payment = paymentRepository.findByStripePaymentIntentId(paymentIntentId)
                .orElseThrow(() -> new RuntimeException("Payment not found"));

        if (payment.getStatus() == PaymentStatus.SUCCEEDED) {
            return; // Қайталанған webhook-тан сақтану
        }

        // Төлем статусын жаңарту
        payment.setStatus(PaymentStatus.SUCCEEDED);
        paymentRepository.save(payment);

        // Билет жасау
        Event event = payment.getEvent();
        User user = payment.getUser();

        // Билет санын азайту
        if (event.getTotalTickets() != null && event.getTotalTickets() > 0) {
            event.setTotalTickets(event.getTotalTickets() - 1);
            eventRepository.save(event);
        }

        // Билет құру
        Ticket ticket = Ticket.builder()
                .event(event)
                .user(user)
                .status("ACTIVE")
                .build();

        Ticket savedTicket = ticketRepository.save(ticket);

        // Payment-ке билетті байлау
        payment.setTicket(savedTicket);
        paymentRepository.save(payment);
    }

    @Scheduled(fixedRate = 3600000) // Сағат сайын
    public void checkExpiredPayments() {
        LocalDateTime oneHourAgo = LocalDateTime.now().minusHours(1);

        List<Payment> expiredPayments = paymentRepository
                .findByStatusAndCreatedAtBefore(PaymentStatus.PENDING, oneHourAgo);

        for (Payment payment : expiredPayments) {
            try {
                Stripe.apiKey = stripeApiKey;
                PaymentIntent intent = PaymentIntent.retrieve(payment.getStripePaymentIntentId());

                if ("requires_payment_method".equals(intent.getStatus())) {
                    // Төлем аяқталмаған - cancel жасау
                    intent.cancel();
                    payment.setStatus(PaymentStatus.CANCELED);
                    paymentRepository.save(payment);
                }
            } catch (StripeException e) {
                System.err.println("Error checking payment: " + e.getMessage());
            }
        }
    }
}