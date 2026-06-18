# Stage 1 — Build
FROM golang:1.25-alpine AS builder

WORKDIR /app

# Install git (dibutuhkan go mod download)
RUN apk add --no-cache git

# Copy go.mod dan go.sum dulu
COPY go.mod go.sum ./
RUN go mod download

# Copy semua source code
COPY . .

# Build binary
RUN go mod tidy
RUN CGO_ENABLED=0 GOOS=linux go build -o main ./cmd/main.go

# Stage 2 — Run
FROM alpine:3.19

WORKDIR /app

RUN apk add --no-cache ca-certificates

COPY --from=builder /app/main .
COPY --from=builder /app/db/migrations ./db/migrations
COPY --from=builder /app/uploads ./uploads

EXPOSE 8888

CMD ["./main"]