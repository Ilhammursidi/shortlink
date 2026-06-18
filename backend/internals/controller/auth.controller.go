package controller

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/ilhammursidi/shortlink/internals/dto"
	"github.com/ilhammursidi/shortlink/internals/services"
)

type AuthController struct {
	authService *services.AuthService
}

func NewAuthController(authService *services.AuthService) *AuthController {
	return &AuthController{authService: authService}
}

func (a *AuthController) Register(c *gin.Context) {
	var req dto.RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.ErrorResponse(err.Error()))
		return
	}
	if err := a.authService.Register(req); err != nil {
		c.JSON(http.StatusBadRequest, dto.ErrorResponse(err.Error()))
		return
	}
	c.JSON(http.StatusCreated, dto.SuccessResponse("Register successful", nil))
}

func (a *AuthController) Login(c *gin.Context) {
	var req dto.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, dto.ErrorResponse(err.Error()))
		return
	}
	resp, err := a.authService.Login(req)
	if err != nil {
		c.JSON(http.StatusBadRequest, dto.ErrorResponse(err.Error()))
		return
	}
	c.JSON(http.StatusOK, dto.SuccessResponse("Login successful", resp))
}
