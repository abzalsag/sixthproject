package com.example.sixthproject.controller;

import com.example.sixthproject.dto.BuyTicketRequest;
import com.example.sixthproject.entity.*;
import com.example.sixthproject.repository.*;
import com.example.sixthproject.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
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
    private final TicketService ticketService;
    private final PushNotificationService pushService;


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



    // 🔥 ЖАҢА: Жазылған адамдардың постары (Feed)
    @GetMapping("/feed")
    public ResponseEntity<List<Event>> getFeed(Principal principal) {
        User currentUser = userRepository.findByUsername(principal.getName()).orElseThrow();

        // Жазылған адамдардың ID-лары
        Set<User> following = currentUser.getFollowing();
        if (following == null || following.isEmpty()) {
            // Жазылым жоқ болса, барлық постарды көрсет
            return ResponseEntity.ok(getAllEvents());
        }

        // Жазылған адамдардың постарын алу
        List<Event> feedEvents = eventRepository.findAll().stream()
                .filter(event -> event.getOrganizer() != null &&
                        following.contains(event.getOrganizer()))
                .sorted((e1, e2) -> e2.getId().compareTo(e1.getId())) // Жаңадан ескіге
                .collect(Collectors.toList());

        return ResponseEntity.ok(feedEvents);
    }

    // 🔥 ЖАҢА: Trending/Popular постар (лайк саны бойынша)
    @GetMapping("/trending")
    public ResponseEntity<List<Event>> getTrending() {
        List<Event> trending = eventRepository.findAll().stream()
                .sorted((e1, e2) -> {
                    int likes1 = e1.getLikes() != null ? e1.getLikes() : 0;
                    int likes2 = e2.getLikes() != null ? e2.getLikes() : 0;
                    return Integer.compare(likes2, likes1); // Көп лайктан азға
                })
                .limit(20) // Топ 20
                .collect(Collectors.toList());

        return ResponseEntity.ok(trending);
    }

    // 🔥 ЖАҢА: Ұсынылған контент (жазылмаған, бірақ қызықты)
    @GetMapping("/recommended")
    public ResponseEntity<List<Event>> getRecommended(Principal principal) {
        User currentUser = userRepository.findByUsername(principal.getName()).orElseThrow();
        Set<User> following = currentUser.getFollowing();

        // Жазылмаған адамдардың популярлы постары
        List<Event> recommended = eventRepository.findAll().stream()
                .filter(event -> event.getOrganizer() != null &&
                        (following == null || !following.contains(event.getOrganizer())))
                .sorted((e1, e2) -> {
                    int likes1 = e1.getLikes() != null ? e1.getLikes() : 0;
                    int likes2 = e2.getLikes() != null ? e2.getLikes() : 0;
                    return Integer.compare(likes2, likes1);
                })
                .limit(10)
                .collect(Collectors.toList());

        return ResponseEntity.ok(recommended);
    }


    // Ивентке қатысушылар (билет алғандар)
    @GetMapping("/{id}/attendees")
    public ResponseEntity<List<User>> getEventAttendees(@PathVariable Long id) {
        return eventRepository.findById(id).map(event -> {
            List<User> attendees = ticketRepository.findAll().stream()
                    .filter(t -> t.getEvent().getId().equals(id))
                    .map(Ticket::getUser)
                    .distinct()
                    .collect(Collectors.toList());
            return ResponseEntity.ok(attendees);
        }).orElse(ResponseEntity.notFound().build());
    }

    // Ивентке қанша адам келеді (билет саны)
    @GetMapping("/{id}/attendees-count")
    public ResponseEntity<Integer> getAttendeesCount(@PathVariable Long id) {
        long count = ticketRepository.findAll().stream()
                .filter(t -> t.getEvent().getId().equals(id))
                .count();
        return ResponseEntity.ok((int) count);
    }

    // Категория бойынша статистика
    @GetMapping("/stats/by-category")
    public ResponseEntity<Map<String, Integer>> getCategoryStats() {
        List<Event> allEvents = eventRepository.findAll();
        Map<String, Integer> stats = allEvents.stream()
                .collect(Collectors.groupingBy(
                        e -> e.getCategory() != null ? e.getCategory() : "Other",
                        Collectors.summingInt(e -> 1)
                ));
        return ResponseEntity.ok(stats);
    }

    // Ең популярлы категориялар (билет саны бойынша)
    @GetMapping("/stats/popular-categories")
    public ResponseEntity<Map<String, Long>> getPopularCategories() {
        List<Ticket> allTickets = ticketRepository.findAll();
        Map<String, Long> stats = allTickets.stream()
                .collect(Collectors.groupingBy(
                        t -> t.getEvent().getCategory() != null ? t.getEvent().getCategory() : "Other",
                        Collectors.counting()
                ));
        return ResponseEntity.ok(stats);
    }

    @Autowired
    private HashtagService hashtagService; // Жаңа қосу

    @PostMapping
    public ResponseEntity<Event> createEvent(@RequestBody Event event, Principal principal) {
        event.setOrganizer(getOrCreateUser(principal));

        // 🔥 ЖАҢА: Хэштегтерді өңдеу
        Set<Hashtag> hashtags = hashtagService.extractHashtags(event.getDescription());
        event.setHashtags(hashtags);

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


    @Autowired
    private NotificationService notificationService; // Жаңа қосу

    @PostMapping("/{id}/like")
    public ResponseEntity<Event> toggleLike(@PathVariable Long id, Principal principal) {
        return eventRepository.findById(id).map(event -> {
            User currentUser = getOrCreateUser(principal);

            if (event.getLikedBy().contains(currentUser)) {
                event.getLikedBy().remove(currentUser);
                event.setLikes(event.getLikes() - 1);
            } else {
                event.getLikedBy().add(currentUser);
                if (event.getLikes() == null) event.setLikes(0);
                event.setLikes(event.getLikes() + 1);

                // 🔥 ЖАҢА: Push notification жіберу
                if (event.getOrganizer() != null && !event.getOrganizer().equals(currentUser)) {
                    pushService.sendToUser(
                            event.getOrganizer(),
                            "Жаңа лайк! ❤️",
                            currentUser.getFirstname() + " сіздің постыңызға лайк басты",
                            event.getImageUrl()
                    );
                }
            }

            return ResponseEntity.ok(eventRepository.save(event));
        }).orElse(ResponseEntity.notFound().build());
    }





    @PostMapping("/{id}/comments")
    public ResponseEntity<Comment> addComment(@PathVariable Long id, @RequestBody Comment comment, Principal principal) {
        return eventRepository.findById(id).map(event -> {
            comment.setEvent(event);
            comment.setUser(getOrCreateUser(principal));

            if (comment.getCreatedAt() == null) {
                comment.setCreatedAt(LocalDateTime.now());
            }

            // 🔥 ЖАҢА: Хабарландыру жіберу
            notificationService.createCommentNotification(comment.getUser(), event);

            return ResponseEntity.ok(commentRepository.save(comment));
        }).orElse(ResponseEntity.notFound().build());
    }

    @Autowired
    private AnalyticsService analyticsService; // Жаңа қосу

   // @PostMapping("/{id}/buy")
  //  public ResponseEntity<Ticket> buyTicket(@PathVariable Long id, Principal principal) {
    //    return eventRepository.findById(id).map(event -> {
      //      User buyer = getOrCreateUser(principal);
        //    Ticket ticket = Ticket.builder()
          //          .event(event)
            //        .user(buyer)
              //      .qrCode(UUID.randomUUID().toString())
                //    .build();

            //Ticket savedTicket = ticketRepository.save(ticket);

            // 🔥 ЖАҢА: Analytics жазу
            //Double price = event.getPrice() != null ? event.getPrice().doubleValue() : 0.0;
            //analyticsService.trackTicketSale(id, price);

            //return ResponseEntity.ok(savedTicket);
        //}).orElse(ResponseEntity.notFound().build());
    //}


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

    // Қала бойынша іздеу
    @GetMapping("/search/location")
    public ResponseEntity<List<Event>> searchByLocation(@RequestParam String city) {
        List<Event> events = eventRepository.findAll().stream()
                .filter(e -> e.getLocation().toLowerCase().contains(city.toLowerCase()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(events);
    }

    // Бағасы бойынша фильтр (мысалы: 0-5000 тг)
    @GetMapping("/search/price")
    public ResponseEntity<List<Event>> searchByPrice(
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice
    ) {
        List<Event> events = eventRepository.findAll().stream()
                .filter(e -> {
                    BigDecimal price = e.getPrice() != null ? e.getPrice() : BigDecimal.ZERO;
                    boolean minOk = minPrice == null || price.compareTo(minPrice) >= 0;
                    boolean maxOk = maxPrice == null || price.compareTo(maxPrice) <= 0;
                    return minOk && maxOk;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(events);
    }

    // Күні бойынша (келесі 7 күн, келесі ай)
    @GetMapping("/search/upcoming")
    public ResponseEntity<List<Event>> getUpcomingEvents(@RequestParam(defaultValue = "7") int days) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime future = now.plusDays(days);

        List<Event> events = eventRepository.findAll().stream()
                .filter(e -> e.getEventDate().isAfter(now) && e.getEventDate().isBefore(future))
                .sorted(Comparator.comparing(Event::getEventDate))
                .collect(Collectors.toList());

        return ResponseEntity.ok(events);
    }

    // Кешенді іздеу (категория + орын + баға)
    @GetMapping("/advanced-search")
    public ResponseEntity<List<Event>> advancedSearch(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) BigDecimal maxPrice
    ) {
        List<Event> events = eventRepository.findAll().stream()
                .filter(e -> {
                    boolean categoryMatch = category == null || category.equals("All") ||
                            e.getCategory().equals(category);
                    boolean locationMatch = location == null ||
                            e.getLocation().toLowerCase().contains(location.toLowerCase());
                    boolean priceMatch = maxPrice == null ||
                            (e.getPrice() != null && e.getPrice().compareTo(maxPrice) <= 0);
                    return categoryMatch && locationMatch && priceMatch;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(events);
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

    // Менің ивенттерімнің статистикасы
    @GetMapping("/my-stats")
    public ResponseEntity<List<Map<String, Object>>> getMyEventsStats(Principal principal) {
        User organizer = userRepository.findByUsername(principal.getName()).orElseThrow();

        List<Event> myEvents = eventRepository.findAll().stream()
                .filter(e -> e.getOrganizer() != null && e.getOrganizer().getId().equals(organizer.getId()))
                .collect(Collectors.toList());

        List<Map<String, Object>> stats = myEvents.stream().map(event -> {
            Map<String, Object> stat = new HashMap<>();
            stat.put("eventId", event.getId());
            stat.put("title", event.getTitle());
            stat.put("likes", event.getLikes());
            stat.put("comments", event.getComments().size());
            stat.put("ticketsSold", event.getTickets().size());
            stat.put("revenue", event.getTickets().size() * (event.getPrice() != null ? event.getPrice().doubleValue() : 0));
            return stat;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/paginated")
    public ResponseEntity<Page<Event>> getAllEventsPaginated(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(eventRepository.findAll(pageable));
    }



    @GetMapping("/my-organized")
    public ResponseEntity<List<Event>> getMyOrganizedEvents(Principal principal) {
        User user = getOrCreateUser(principal);
        return ResponseEntity.ok(eventRepository.findAllByOrganizerId(user.getId()));
    }



    @Autowired
    private RatingRepository ratingRepository;

    @PostMapping("/{id}/rate")
    public ResponseEntity<?> rateEvent(
            @PathVariable Long id,
            @RequestBody Map<String, Integer> request,
            Principal principal) {

        return eventRepository.findById(id).map(event -> {
            User user = getOrCreateUser(principal);
            Integer ratingValue = request.get("rating");

            // Валидация
            if (ratingValue == null || ratingValue < 1 || ratingValue > 5) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Рейтинг 1-5 аралығында болуы керек"));
            }

            // Бұрынғы рейтингті тексеру
            Optional<Rating> existingRating = ratingRepository
                    .findByUserAndEvent(user, event);

            Rating rating;
            if (existingRating.isPresent()) {
                // Рейтингті жаңарту
                rating = existingRating.get();
                rating.setRating(ratingValue);
            } else {
                // Жаңа рейтинг қосу
                rating = Rating.builder()
                        .user(user)
                        .event(event)
                        .rating(ratingValue)
                        .build();
            }

            ratingRepository.save(rating);

            // Орташа рейтингті есептеу
            List<Rating> allRatings = ratingRepository.findByEvent(event);
            Double avgRating = allRatings.stream()
                    .mapToInt(Rating::getRating)
                    .average()
                    .orElse(0.0);

            event.setAverageRating(avgRating);
            eventRepository.save(event);

            return ResponseEntity.ok(Map.of(
                    "message", "Рейтинг сәтті сақталды",
                    "averageRating", avgRating,
                    "totalRatings", allRatings.size()
            ));
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/ratings")
    public ResponseEntity<?> getEventRatings(@PathVariable Long id) {
        return eventRepository.findById(id).map(event -> {
            List<Rating> ratings = ratingRepository.findByEvent(event);
            return ResponseEntity.ok(Map.of(
                    "averageRating", event.getAverageRating(),
                    "totalRatings", ratings.size(),
                    "ratings", ratings
            ));
        }).orElse(ResponseEntity.notFound().build());
    }
}