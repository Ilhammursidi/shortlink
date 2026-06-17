# Stage 1 — Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package dulu (layer cache)
COPY package.json package-lock.json ./
RUN npm install

# Copy semua source
COPY . .

# Terima VITE_BASE_URL dari docker-compose build args
ARG VITE_BASE_URL
ENV VITE_BASE_URL=$VITE_BASE_URL

# Build static files
RUN npm run build

# Stage 2 — Serve
FROM nginx:stable-alpine

# Copy hasil build ke nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]