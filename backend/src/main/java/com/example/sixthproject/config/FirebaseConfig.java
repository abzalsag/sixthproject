package com.example.sixthproject.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.springframework.context.annotation.Configuration;
import javax.annotation.PostConstruct;
import java.io.ByteArrayInputStream;
import java.io.FileInputStream;
import java.io.InputStream;

@Configuration
public class FirebaseConfig {

    @PostConstruct
    public void initialize() {
        try {
            // Production: FIREBASE_SERVICE_ACCOUNT_JSON env variable
            // Dev: firebase-service-account.json file
            String envJson = System.getenv("FIREBASE_SERVICE_ACCOUNT_JSON");
            InputStream serviceAccount;

            if (envJson != null && !envJson.isEmpty()) {
                serviceAccount = new ByteArrayInputStream(envJson.getBytes());
            } else {
                serviceAccount = new FileInputStream("firebase-service-account.json");
            }

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();

            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}