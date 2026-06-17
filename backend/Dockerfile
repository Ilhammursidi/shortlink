FROM golang:1.25-alpine AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .
RUN go build -o main ./cmd/main.go

FROM alpine:3.18
# RUN apk add --no-cache ca-certificates
WORKDIR /app

COPY --from=builder /app/main .

COPY --from=builder /app/db/migrations ./db/migrations

# ENV PORT=8888
EXPOSE 8888
CMD ["./main"]
