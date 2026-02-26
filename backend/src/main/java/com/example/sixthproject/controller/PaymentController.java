package com.example.sixthproject.controller;

import com.example.sixthproject.entity.*;
import com.example.sixthproject.repository.EventRepository;
import com.example.sixthproject.repository.PaymentRepository;
import com.example.sixthproject.repository.UserRepository;
import com.example.sixthproject.service.StripePaymentService;
import com.stripe.exception.SignatureVerificationException;
import com.stripe.exception.StripeException;
import com.stripe.model.Charge;
import com.stripe.model.PaymentIntent;
import com.stripe.net.Webhook;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final StripePaymentService paymentService;
    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;
    private final EventRepository eventRepository;

    @Value("${stripe.api.key}")
    private String stripeApiKey;

    @Value("${stripe.webhook.secret}")
    private String webhookSecret;

    // 🔥 45-ші жолдағы } жақшаны ӨШІРІҢІЗ!

    // Payment Intent құру
    @PostMapping("/create-intent")
    public ResponseEntity<?> createPaymentIntent(
            @RequestBody Map<String, Long> request,
            Principal principal
    ) {
        try {
            Long eventId = request.get("eventId");
            Map<String, String> response = paymentService.createPaymentIntent(
                    eventId,
                    principal.getName()
            );
            return ResponseEntity.ok(response);
        } catch (StripeException e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/confirm")
    public ResponseEntity<?> confirmPayment(@RequestBody Map<String, String> request) {
        try {
            String paymentIntentId = request.get("paymentIntentId");
            Ticket ticket = paymentService.confirmPayment(paymentIntentId);
            return ResponseEntity.ok(ticket);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/failed")
    public ResponseEntity<?> handleFailure(@RequestBody Map<String, String> request) {
        String paymentIntentId = request.get("paymentIntentId");
        String reason = request.get("reason");
        paymentService.handlePaymentFailure(paymentIntentId, reason);
        return ResponseEntity.ok(Map.of("message", "Payment failure recorded"));
    }

    @PostMapping("/webhook")
    public ResponseEntity<?> handleStripeWebhook(
            @RequestBody String payload,
            @RequestHeader("Stripe-Signature") String sigHeader
    ) {
        com.stripe.model.Event event;

        try {
            event = Webhook.constructEvent(payload, sigHeader, webhookSecret);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Webhook қатесі: " + e.getMessage());
        }

        if ("payment_intent.succeeded".equals(event.getType())) {
            PaymentIntent intent = (PaymentIntent) event.getDataObjectDeserializer()
                    .getObject().orElse(null);
            if (intent != null) {
                paymentService.handlePaymentSuccess(intent.getId());
            }
        }  else if ("payment_intent.payment_failed".equals(event.getType())) {
        PaymentIntent intent = (PaymentIntent) event.getDataObjectDeserializer()
                .getObject().orElse(null);
        if (intent != null) {
            // 🔥 ТҮЗЕТУ: Қатенің себебін (reason) қосып жібереміз
            String failureReason = intent.getLastPaymentError() != null
                    ? intent.getLastPaymentError().getMessage()
                    : "Төлем белгісіз себеппен өтпеді";

            paymentService.handlePaymentFailure(intent.getId(), failureReason);
        }
    }

        return ResponseEntity.ok("Webhook өңделді");
    }

    @GetMapping("/my-payments")
    public ResponseEntity<List<Payment>> getMyPayments(Principal principal) {
        User user = userRepository.findByUsername(principal.getName()).orElseThrow();
        List<Payment> payments = paymentRepository.findByUserOrderByCreatedAtDesc(user);
        return ResponseEntity.ok(payments);
    }

    @GetMapping("/{paymentId}/receipt")
    public ResponseEntity<Map<String, Object>> getPaymentReceipt(@PathVariable Long paymentId, Principal principal) {
        Payment payment = paymentRepository.findById(paymentId).orElseThrow();

        if (!payment.getUser().getUsername().equals(principal.getName())) {
            return ResponseEntity.status(403).build();
        }

        Map<String, Object> receipt = new HashMap<>();
        receipt.put("paymentId", payment.getId());
        receipt.put("eventTitle", payment.getEvent().getTitle());
        receipt.put("amount", payment.getAmount());
        receipt.put("currency", payment.getCurrency());
        receipt.put("status", payment.getStatus());
        receipt.put("paymentDate", payment.getCreatedAt());
        receipt.put("ticketQrCode", payment.getTicket() != null ? payment.getTicket().getQrCode() : null);

        return ResponseEntity.ok(receipt);
    }

    @GetMapping("/event/{eventId}/analytics")
    public ResponseEntity<Map<String, Object>> getEventPaymentAnalytics(
            @PathVariable Long eventId,
            Principal principal
    ) {
        com.example.sixthproject.entity.Event event = eventRepository.findById(eventId).orElseThrow();

        if (!event.getOrganizer().getUsername().equals(principal.getName())) {
            return ResponseEntity.status(403).build();
        }

        List<Payment> payments = paymentRepository.findByEvent(event);

        Map<String, Object> analytics = new HashMap<>();
        analytics.put("totalRevenue", payments.stream()
                .filter(p -> p.getStatus() == PaymentStatus.SUCCEEDED)
                .mapToDouble(p -> p.getAmount().doubleValue())
                .sum());

        analytics.put("totalTicketsSold", payments.stream()
                .filter(p -> p.getStatus() == PaymentStatus.SUCCEEDED)
                .count());

        analytics.put("pendingPayments", payments.stream()
                .filter(p -> p.getStatus() == PaymentStatus.PENDING)
                .count());

        analytics.put("refundedPayments", payments.stream()
                .filter(p -> p.getStatus() == PaymentStatus.REFUNDED)
                .count());

        analytics.put("failedPayments", payments.stream()
                .filter(p -> p.getStatus() == PaymentStatus.FAILED)
                .count());

        return ResponseEntity.ok(analytics);
    }
} // ← КЛАСС ОСЫНДА ЖАБЫЛУЫ КЕРЕК (файлдың соңында)