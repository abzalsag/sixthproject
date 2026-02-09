package com.example.sixthproject.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "_user")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String firstname;
    private String lastname;

    // 🔥 БҰЛ — СЕНІҢ ЖАҢА НИКНЕЙМІҢ (Instagram сияқты)
    @Column(unique = true) // Ник қайталанбауы керек
    private String username;

    @Column(unique = true)
    private String email;

    @JsonIgnore
    private String password;

    private String avatarUrl;

    @Enumerated(EnumType.STRING)
    private Role role;

    // --- SETTINGS (Ескі кодтарың сол күйі қалды) ---
    private String city;
    private String bio;
    private String gender;

    @Column(columnDefinition = "boolean default false")
    private boolean isPrivate = false;

    @Column(columnDefinition = "boolean default true")
    private boolean showOnlineStatus = true;

    @Column(columnDefinition = "boolean default true")
    private boolean pushNotifications = true;

    @Column(columnDefinition = "boolean default false")
    private boolean emailNotifications = false;

    private String interests;

    // --- FOLLOWERS / FOLLOWING (Тиіспедім) ---
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_following",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "following_id")
    )
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @JsonIgnore
    private Set<User> following;

    @ManyToMany(mappedBy = "following")
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @JsonIgnore
    private Set<User> followers;

    // САНАҒЫШТАР
    public int getFollowersCount() {
        return followers == null ? 0 : followers.size();
    }

    public int getFollowingCount() {
        return following == null ? 0 : following.size();
    }

    // --- UserDetails ---
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (role == null) return List.of(new SimpleGrantedAuthority("ROLE_USER"));
        return List.of(new SimpleGrantedAuthority(role.name()));
    }

    @Override public String getPassword() { return password; }

    // Логин ретінде әзірге EMAIL қала берсін (немесе username қайтарсаң болады)
    @Override public String getUsername() { return username; }

    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return true; }
}