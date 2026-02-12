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
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

    private final EventRepository eventRepository;
    private final UserRepository userRepository;
    private final CommentRepository commentRepository;
    private final TicketRepository ticketRepository;


    private User getOrCreateUser(Principal principal) {
        if (principal != null) {

            return userRepository.findByUsername(principal.getName())
                    .orElse(userRepository.findByEmail(principal.getName())
                            .orElse(getGuestUser()));
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
                    guest.setUsername("guest_user");
                    guest.setPassword("12345");
                    return userRepository.save(guest);
                });
    }


    @GetMapping
    public List<Event> getAllEvents() {
        List<Event> events = eventRepository.findAll();
        Collections.reverse(events);
        return events;
    }


    @PostMapping
    public ResponseEntity<Event> createEvent(@RequestBody Event event, Principal principal) {
        event.setOrganizer(getOrCreateUser(principal));
        return ResponseEntity.ok(eventRepository.save(event));
    }


    @GetMapping("/my-posts")
    public ResponseEntity<List<Event>> getMyPosts(Principal principal) {
        User currentUser = getOrCreateUser(principal);

        List<Event> myEvents = eventRepository.findAll().stream()
                .filter(e -> e.getOrganizer() != null && e.getOrganizer().getId().equals(currentUser.getId()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(myEvents);
    }


    @PostMapping("/{id}/like")
    public ResponseEntity<Event> toggleLike(@PathVariable Long id, Principal principal) {
        return eventRepository.findById(id).map(event -> {
            User currentUser = getOrCreateUser(principal);

            if (event.getLikedBy().contains(currentUser)) {
                event.getLikedBy().remove(currentUser);
                event.setLikes(Math.max(0, event.getLikes() - 1));
            } else {
                event.getLikedBy().add(currentUser);
                if (event.getLikes() == null) event.setLikes(0);
                event.setLikes(event.getLikes() + 1);
            }

            return ResponseEntity.ok(eventRepository.save(event));
        }).orElse(ResponseEntity.notFound().build());
    }


    @PostMapping("/{id}/comments")
    public ResponseEntity<Comment> addComment(
            @PathVariable Long id,
            @RequestBody Map<String, String> body,
            Principal principal
    ) {
        User user = getOrCreateUser(principal);

        return eventRepository.findById(id).map(event -> {
            Comment comment = Comment.builder()
                    .content(body.get("content"))
                    .user(user)
                    .event(event)
                    .build();

            return ResponseEntity.ok(commentRepository.save(comment));
        }).orElse(ResponseEntity.notFound().build());
    }


    @GetMapping("/{id}/comments")
    public ResponseEntity<List<Comment>> getComments(@PathVariable Long id) {
        // Жаңа репозиторий әдісін қолданамыз
        return ResponseEntity.ok(commentRepository.findAllByEventId(id));
    }


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


    @GetMapping("/tickets/my")
    public ResponseEntity<List<Ticket>> getMyTickets(Principal principal) {
        User currentUser = getOrCreateUser(principal);
        List<Ticket> myTickets = ticketRepository.findAll().stream()
                .filter(t -> t.getUser().getId().equals(currentUser.getId()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(myTickets);
    }


    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable Long id) {
        return eventRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }


    @GetMapping("/search")
    public ResponseEntity<List<Event>> searchEvents(@RequestParam String query) {
        if (query == null || query.trim().isEmpty()) {
            return ResponseEntity.ok(Collections.emptyList());
        }
        return ResponseEntity.ok(eventRepository.findByTitleContainingIgnoreCaseOrLocationContainingIgnoreCase(query, query));
    }


    @GetMapping("/filter")
    public ResponseEntity<List<Event>> getEventsByCategory(@RequestParam String category) {
        if ("All".equals(category) || category == null) {
            List<Event> allEvents = eventRepository.findAll();
            Collections.reverse(allEvents);
            return ResponseEntity.ok(allEvents);
        }
        return ResponseEntity.ok(eventRepository.findByCategory(category));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id, Principal principal) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Пост табылмады"));

        String currentUsername = principal.getName();

        if (!event.getOrganizer().getUsername().equals(currentUsername) &&
                !event.getOrganizer().getEmail().equals(currentUsername)) {
            return ResponseEntity.status(403).body("Бұл сіздің постыңыз емес!");
        }

        eventRepository.delete(event);
        return ResponseEntity.ok("Пост сәтті өшірілді");
    }


    @GetMapping("/{id}/friends-going")
    public ResponseEntity<List<User>> getFriendsGoing(@PathVariable Long id, Principal principal) {
        if (principal == null) return ResponseEntity.ok(Collections.emptyList());

        User currentUser = userRepository.findByUsername(principal.getName())
                .orElse(userRepository.findByEmail(principal.getName()).orElseThrow());

        List<Ticket> tickets = ticketRepository.findAll().stream()
                .filter(t -> t.getEvent().getId().equals(id))
                .collect(Collectors.toList());

        List<User> friendsGoing = new ArrayList<>();

        if (currentUser.getFollowing() != null) {
            for (Ticket ticket : tickets) {
                if (currentUser.getFollowing().contains(ticket.getUser())) {
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
        User user = getOrCreateUser(principal);
        return ResponseEntity.ok(eventRepository.findAllByOrganizerId(user.getId()));
    }
}