# ── 1. BUILD ──────────────────────────────────────────
FROM gradle:8.5-jdk17 AS builder
WORKDIR /app
COPY build.gradle settings.gradle ./
COPY src ./src
RUN gradle bootJar --no-daemon -x test

# ── 2. RUN ────────────────────────────────────────────
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

RUN addgroup -S tusa && adduser -S tusa -G tusa
RUN mkdir -p /app/uploads && chown -R tusa:tusa /app

COPY --from=builder /app/build/libs/app.jar app.jar

USER tusa
EXPOSE 8080

ENV JAVA_OPTS="-Xmx512m -Xms128m"
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]