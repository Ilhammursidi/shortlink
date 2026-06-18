package di

import (
	"context"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/ilhammursidi/shortlink/internals/controller"
	"github.com/ilhammursidi/shortlink/internals/repository"
	"github.com/ilhammursidi/shortlink/internals/routes"
	"github.com/ilhammursidi/shortlink/internals/services"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/redis/go-redis/v9"
)

func Init() *gin.Engine {
	dbURL := os.Getenv("DATABASE_URL")

	// Inisialisasi koneksi database Postgres
	db, err := pgxpool.New(context.Background(), dbURL)
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}
	if err := db.Ping(context.Background()); err != nil {
		log.Fatalf("database unreachable: %v", err)
	}
	log.Println("database connected")

	// Inisialisasi koneksi Redis cache
	rdb := redis.NewClient(&redis.Options{
		Addr: os.Getenv("REDIS_HOST") + ":" + os.Getenv("REDIS_PORT"),
	})

	if _, err := rdb.Ping(context.Background()).Result(); err != nil {
		log.Fatalf("failed to connect to redis: %v", err)
	}
	log.Println("redis connected")

	// Dependency Injection Setup
	authRepo := repository.NewAuthRepository(db)
	linkRepo := repository.NewLinkRepository(db, rdb)
	userRepo := repository.NewUserRepository(db)

	authService := services.NewAuthService(authRepo)
	linkService := services.NewLinkService(linkRepo)
	userService := services.NewUserService(userRepo)

	authController := controller.NewAuthController(authService)
	linkController := controller.NewLinkController(linkService)
	userController := controller.NewUserController(userService)

	r := gin.Default()
	routes.Register(r, authController, linkController, userController)
	return r
}
