package com.example.sixthproject.repository;

import com.example.sixthproject.entity.Event;
import com.example.sixthproject.entity.Payment;
import com.example.sixthproject.entity.PaymentStatus;
import com.example.sixthproject.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime; // 🔥 Бұл импорт өте маңызды!
import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {

    // 1. Stripe ID арқылы іздеу
    Optional<Payment> findByStripePaymentIntentId(String paymentIntentId);

    // 2. Юзердің барлық төлемдері (қарапайым)
    List<Payment> findByUser(User user);

    // 3. Юзердің төлемдері (уақытымен сұрыпталған)
    List<Payment> findByUserOrderByCreatedAtDesc(User user);

    // 4. Ивент бойынша (Аналитика үшін)
    List<Payment> findByEvent(Event event);

    // 5. Статус бойынша
    List<Payment> findByStatus(PaymentStatus status);
    List<Payment> findByUserAndStatus(User user, PaymentStatus status);

    // 🔥 6. МІНЕ, ОСЫ ФУНКЦИЯ ЖЕТІСПЕЙ ТҰРҒАН (Тазалау жұмыстары үшін)
    // "Белгілі бір уақыттан бұрын жасалған және белгілі бір статустағы" төлемдерді табу
    List<Payment> findByStatusAndCreatedAtBefore(PaymentStatus status, LocalDateTime dateTime);
}