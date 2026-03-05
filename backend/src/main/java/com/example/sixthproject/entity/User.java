package com.example.sixthproject.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "_user")
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    private String firstname;
    private String lastname;

    @Column(unique = true)
    private String username;

    @Column(unique = true)
    private String email;

    @JsonIgnore
    private String password;

    private String avatarUrl;

    @Enumerated(EnumType.STRING)
    private Role role;

    private String city;
    private String bio;
    private String gender;
    private String interests;

    @Column(columnDefinition = "boolean default false")
    private boolean isPrivate = false;

    @Column(columnDefinition = "boolean default true")
    private boolean showOnlineStatus = true;

    @Column(columnDefinition = "boolean default true")
    private boolean pushNotifications = true;

    @Column(columnDefinition = "boolean default false")
    private boolean emailNotifications = false;

    @Column(columnDefinition = "boolean default true")
    private boolean accountNonLocked = true;

    // Email verification
    private String verificationCode;
    private LocalDateTime verificationCodeExpiresAt;

    // Following/Followers
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_following",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "following_id")
    )
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @JsonIgnore
    private Set<User> following = new HashSet<>();

    @ManyToMany(mappedBy = "following", fetch = FetchType.EAGER)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @JsonIgnore
    private Set<User> followers = new HashSet<>();

    @Transient
    @com.fasterxml.jackson.annotation.JsonProperty("followersCount")
    public int getFollowersCount() {
        return followers == null ? 0 : followers.size();
    }

    @Transient
    @com.fasterxml.jackson.annotation.JsonProperty("followingCount")
    public int getFollowingCount() {
        return following == null ? 0 : following.size();
    }

    // UserDetails implementation
    @Override
    @JsonIgnore
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (role == null) return List.of(new SimpleGrantedAuthority("ROLE_USER"));
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override
    public String getPassword() { return password; }

    @Override
    public String getUsername() { return username; }

    @Override
    @JsonIgnore
    public boolean isAccountNonExpired() { return true; }

    @Override
    @JsonIgnore
    public boolean isAccountNonLocked() { return accountNonLocked; }

    @Override
    @JsonIgnore
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    @JsonIgnore
    public boolean isEnabled() { return true; }

    @ManyToMany
    @JoinTable(
            name = "user_saved_events",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "event_id")
    )
    @JsonIgnore
    private Set<Event> savedEvents = new HashSet<>();

    @ManyToMany
    @JoinTable(
            name = "user_saved_posts",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "post_id")
    )
    private Set<Post> savedPosts;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}