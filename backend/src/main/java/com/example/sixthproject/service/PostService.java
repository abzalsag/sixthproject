package com.example.sixthproject.service;

import com.example.sixthproject.entity.Post;
import com.example.sixthproject.entity.User;
import com.example.sixthproject.repository.PostRepository;
import com.example.sixthproject.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final FileStorageService fileStorageService;


    public Post createPost(String username, String caption, MultipartFile file) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User табылмады!"));

        // Файл міндетті емес — text-only пост рұқсат
        String imageUrl = null;
        if (file != null && !file.isEmpty()) {
            imageUrl = fileStorageService.uploadFile(file);
        }

        Post post = Post.builder()
                .caption(caption)
                .imageUrl(imageUrl)
                .user(user)
                .likesCount(0)
                .build();

        return postRepository.save(post);
    }


    public List<Post> getAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc();
    }


    public List<Post> getFeedPosts(String username) {
        User currentUser = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));


        var followingList = currentUser.getFollowing();


        if (followingList.isEmpty()) {
            return List.of();
        }

        return postRepository.findByUserInOrderByCreatedAtDesc(followingList);
    }
}