# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage - Nginx to serve static files
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx config for React Router (SPA support)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
