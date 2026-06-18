package routes

import (
	"github.com/gin-gonic/gin"
	"github.com/ilhammursidi/shortlink/internals/controller"
	"github.com/ilhammursidi/shortlink/internals/middleware"
)

func Register(
	r *gin.Engine,
	auth *controller.AuthController,
	link *controller.LinkController,
	user *controller.UserController,
) {
	r.Use(middleware.CorsMiddleware())
	r.Static("/uploads", "./uploads")
	r.GET("/:slug", link.Redirect)

	api := r.Group("/api")
	api.POST("/auth/register", auth.Register)
	api.POST("/auth/login", auth.Login)

	protected := api.Group("")
	protected.Use(middleware.JWTMiddleware())
	protected.POST("/links", link.Create)
	protected.GET("/links/:user_id", link.GetByUser)
	protected.DELETE("/links/:id", link.Delete)
	protected.POST("/user/:id/picture", user.UploadPicture)
}
