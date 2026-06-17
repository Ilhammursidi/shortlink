package di

import (
	"context"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/golang-migrate/migrate/v4"
	"github.com/ilhammursidi/shortlink/internals/controller"
	"github.com/ilhammursidi/shortlink/internals/repository"
	"github.com/ilhammursidi/shortlink/internals/routes"
	"github.com/ilhammursidi/shortlink/internals/services"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/redis/go-redis/v9"
)

func Init() *gin.Engine {
	db, err := pgxpool.New(context.Background(), os.Getenv("DATABASE_URL"))
	if err != nil {
		// panic(err)
		log.Fatalf("failed to connect to database: %v", err)
	}
	if err := db.Ping(context.Background()); err != nil {
		log.Fatalf("database unreachable: %v", err)
	}
	log.Println("database connected")

	m, err := migrate.New("file://db/migrations", os.Getenv("DATABASE_URL"))
	if err != nil {
		// panic(err)
		log.Fatalf("failed to init migration: %v", err)
	}

	if err := m.Up(); err != nil && err != migrate.ErrNoChange {
		log.Fatalf("failed to run migration: %v", err)
	}
	log.Println("migration done")

	rdb := redis.NewClient(&redis.Options{
		Addr: os.Getenv("REDIS_HOST") + ":" + os.Getenv("REDIS_PORT"),
	})

	if _, err := rdb.Ping(context.Background()).Result(); err != nil {
		log.Fatalf("failed to connect to redis: %v", err)
	}
	log.Println("redis connected")

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
