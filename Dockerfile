# 1. Ескі OpenJDK орнына Amazon Corretto 17 аламыз (Бұл 100% жұмыс істейді)
FROM amazoncorretto:17

# 2. Жұмыс папкасы
WORKDIR /app

# 3. Файлды көшіру
COPY build/libs/*.jar app.jar

# 4. Порт
EXPOSE 8080

# 5. Іске қосу
ENTRYPOINT ["java", "-jar", "app.jar"]