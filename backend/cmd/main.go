package main

import (
	"log"
	"os"

	"github.com/ilhammursidi/shortlink/internals/di"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Printf("Warning, .env not found: %v", err)
	}

	r := di.Init()

	port := os.Getenv("PORT")
	if port == "" {
		port = "8888"
	}
	log.Printf("server running on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("failed to start server: %v", err)
	}
}
