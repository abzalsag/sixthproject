package com.example.sixthproject.controller;

import com.example.sixthproject.entity.Comment;
import com.example.sixthproject.entity.Event;
import com.example.sixthproject.entity.Ticket;
import com.example.sixthproject.entity.User;
import com.example.sixthproject.repository.CommentRepository;
import com.example.sixthproject.repository.EventRepository;
import com.example.sixthproject.repository.TicketRepository;
import com.example.sixthproject.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;
    private final TicketRepository ticketRepository;

    // --- 1. КӨМЕКШІ ФУНКЦИЯ ---
    private User getOrCreateUser(Principal principal) {
        if (principal != null) {
            return userRepository.findByEmail(principal.getName())
                    .orElse(getGuestUser());
        }
        return getGuestUser();
    }

    private User getGuestUser() {
        return userRepository.findByEmail("guest@tusa.kz")
                .orElseGet(() -> {
                    User guest = new User();
                    guest.setFirstname("Guest");
                    guest.setLastname("User");
                    guest.setEmail("guest@tusa.kz");
                    guest.setPassword("12345");
                    return userRepository.save(guest);
                });
    }

    // --- 2. ЛЕНТА ---
    @GetMapping
    public List<Event> getAllEvents() {
        List<Event> events = eventRepository.findAll();
        Collections.reverse(events);
        return events;
    }

    // --- 3. ИВЕНТ ҚҰРУ ---
    @PostMapping
    public ResponseEntity<Event> createEvent(@RequestBody Event event, Principal principal) {
        event.setOrganizer(getOrCreateUser(principal));
        return ResponseEntity.ok(eventRepository.save(event));
    }

    // --- 4. МЕНІҢ ПОСТТАРЫМ ---
    @GetMapping("/my-posts")
    public ResponseEntity<List<Event>> getMyPosts(Principal principal) {
        User currentUser = getOrCreateUser(principal);
        List<Event> myEvents = eventRepository.findAll().stream()
                .filter(e -> e.getOrganizer() != null && e.getOrganizer().getId().equals(currentUser.getId()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(myEvents);
    }

    // --- 5. ЛАЙК БАСУ (ЖАҢАРТЫЛҒАН ЛОГИКА) ---
    @PostMapping("/{id}/like")
    public ResponseEntity<Event> toggleLike(@PathVariable Long id, Principal principal) {
        return eventRepository.findById(id).map(event -> {
            User currentUser = getOrCreateUser(principal);

            // Тексеру: Бұл адам лайк басқан ба?
            if (event.getLikedBy().contains(currentUser)) {
                // Иә -> Лайкты алып тастаймыз (Minus)
                event.getLikedBy().remove(currentUser);
                event.setLikes(event.getLikes() - 1);
            } else {
                // Жоқ -> Лайк қосамыз (Plus)
                event.getLikedBy().add(currentUser);
                if (event.getLikes() == null) event.setLikes(0);
                event.setLikes(event.getLikes() + 1);
            }

            return ResponseEntity.ok(eventRepository.save(event));
        }).orElse(ResponseEntity.notFound().build());
    }

    // --- 6. КОММЕНТ ЖАЗУ ---
    @PostMapping("/{id}/comments")
    public ResponseEntity<Comment> addComment(@PathVariable Long id, @RequestBody Comment comment, Principal principal) {
        return eventRepository.findById(id).map(event -> {
            comment.setEvent(event);
            comment.setUser(getOrCreateUser(principal));

            if (comment.getCreatedAt() == null) {
                comment.setCreatedAt(LocalDateTime.now());
            }

            return ResponseEntity.ok(commentRepository.save(comment));
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/comments")
    public ResponseEntity<List<Comment>> getComments(@PathVariable Long id) {
        return eventRepository.findById(id)
                .map(event -> ResponseEntity.ok(commentRepository.findByEvent(event)))
                .orElse(ResponseEntity.notFound().build());
    }

    // --- 7. БИЛЕТ САТЫП АЛУ ---
    @PostMapping("/{id}/buy")
    public ResponseEntity<Ticket> buyTicket(@PathVariable Long id, Principal principal) {
        return eventRepository.findById(id).map(event -> {
            User buyer = getOrCreateUser(principal);
            Ticket ticket = Ticket.builder()
                    .event(event)
                    .user(buyer)
                    .qrCode(UUID.randomUUID().toString())
                    .build();
            return ResponseEntity.ok(ticketRepository.save(ticket));
        }).orElse(ResponseEntity.notFound().build());
    }

    // --- 8. МЕНІҢ БИЛЕТТЕРІМ ---
    @GetMapping("/tickets/my")
    public ResponseEntity<List<Ticket>> getMyTickets(Principal principal) {
        User currentUser = getOrCreateUser(principal);
        List<Ticket> myTickets = ticketRepository.findAll().stream()
                .filter(t -> t.getUser().getId().equals(currentUser.getId()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(myTickets);
    }

    // --- 9. ID БОЙЫНША АЛУ ---
    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable Long id) {
        return eventRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Event>> searchEvents(@RequestParam String query) {
        // Егер іздеу жолағы бос болса, бәрін шығарамыз (немесе бос тізім, қалауыңша)
        if (query == null || query.trim().isEmpty()) {
            return ResponseEntity.ok(Collections.emptyList());
        }
        List<Event> foundEvents = eventRepository.findByTitleContainingIgnoreCaseOrLocationContainingIgnoreCase(query, query);
        return ResponseEntity.ok(foundEvents);
    }

    @GetMapping("/filter")
    public ResponseEntity<List<Event>> getEventsByCategory(@RequestParam String category) {
        if ("All".equals(category) || category == null) {
            // Егер "All" таңдалса, бәрін қайтарамыз (кері ретпен)
            List<Event> allEvents = eventRepository.findAll();
            java.util.Collections.reverse(allEvents);
            return ResponseEntity.ok(allEvents);
        }
        // Әйтпесе тек сол категорияны қайтарамыз
        return ResponseEntity.ok(eventRepository.findByCategory(category));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id, Principal principal) {
        // 1. Постты табамыз
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Пост табылмады"));

        // 2. Өшіргісі келген адам — осы посттың иесі ме?
        String currentUserEmail = principal.getName();
        if (!event.getOrganizer().getEmail().equals(currentUserEmail)) {
            return ResponseEntity.status(403).body("Бұл сіздің постыңыз емес!");
        }

        // 3. Өшіреміз
        eventRepository.delete(event);
        return ResponseEntity.ok("Пост сәтті өшірілді");
    }

    @GetMapping("/{id}/friends-going")
    public ResponseEntity<List<User>> getFriendsGoing(@PathVariable Long id, Principal principal) {
        User currentUser = userRepository.findByEmail(principal.getName()).orElseThrow();

        // 1. Осы ивентке билет алған барлық адамдарды табамыз
        List<Ticket> tickets = ticketRepository.findAll().stream()
                .filter(t -> t.getEvent().getId().equals(id))
                .collect(Collectors.toList());

        // 2. Билет алғандардың ішінен МЕНІҢ ДОСТАРЫМДЫ сүзіп аламыз
        List<User> friendsGoing = new ArrayList<>();

        if (currentUser.getFollowing() != null) {
            for (Ticket ticket : tickets) {
                if (currentUser.getFollowing().contains(ticket.getUser())) {
                    // Бір адам екі билет алса, екі рет қосылмау үшін тексеру:
                    if (!friendsGoing.contains(ticket.getUser())) {
                        friendsGoing.add(ticket.getUser());
                    }
                }
            }
        }

        return ResponseEntity.ok(friendsGoing);
    }

    @GetMapping("/my-organized")
    public ResponseEntity<List<Event>> getMyOrganizedEvents(Principal principal) {
        User user = userRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Repository-ден user ID арқылы іздейміз
        return ResponseEntity.ok(eventRepository.findAllByOrganizerId(user.getId()));
    }



}