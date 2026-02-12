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

    @Column(columnDefinition = "boolean default false")
    private boolean isPrivate = false;

    @Column(columnDefinition = "boolean default true")
    private boolean showOnlineStatus = true;

    @Column(columnDefinition = "boolean default true")
    private boolean pushNotifications = true;

    @Column(columnDefinition = "boolean default false")
    private boolean emailNotifications = false;

    private String interests;



    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "user_following",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "following_id")
    )
    @ToString.Exclude
    @JsonIgnore

    private Set<User> following = new HashSet<>();

    @ManyToMany(mappedBy = "following", fetch = FetchType.EAGER)
    @ToString.Exclude
    @JsonIgnore
    private Set<User> followers = new HashSet<>();


    @Transient
    public int getFollowersCount() {
        return followers == null ? 0 : followers.size();
    }

    @Transient
    public int getFollowingCount() {
        return following == null ? 0 : following.size();
    }



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
    public boolean isAccountNonLocked() { return true; }

    @Override
    @JsonIgnore
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    @JsonIgnore
    public boolean isEnabled() { return true; }



    private String verificationCode;
    private LocalDateTime verificationCodeExpiresAt;

    @ManyToMany
    @JoinTable(
            name = "user_saved_posts",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "post_id")
    )
    @JsonIgnore
    private Set<Post> savedPosts = new HashSet<>();
}