# 1. Build stage - Gradle build
FROM gradle:8.5-jdk17 AS builder
WORKDIR /app
COPY build.gradle settings.gradle ./
COPY gradle ./gradle
COPY src ./src
RUN gradle build -x test --no-daemon

# 2. Production stage - Amazon Corretto 17
FROM amazoncorretto:17-alpine
WORKDIR /app

# 3. JAR файлды көшіру
COPY --from=builder /app/build/libs/*.jar app.jar

# 4. Порт
EXPOSE 8080

# 5. Production profile-мен іске қосу
# Firebase credentials: FIREBASE_SERVICE_ACCOUNT_JSON env variable арқылы жіберіледі
ENTRYPOINT ["java", "-Dspring.profiles.active=prod", "-jar", "app.jar"]