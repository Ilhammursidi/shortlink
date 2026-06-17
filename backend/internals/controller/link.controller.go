package controller

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/ilhammursidi/shortlink/internals/dto"
	"github.com/ilhammursidi/shortlink/internals/services"
)

type LinkController struct {
	linkService *services.LinkService
}

func NewLinkController(linkService *services.LinkService) *LinkController {
	return &LinkController{linkService: linkService}
}

func (l *LinkController) Create(c *gin.Context) {
	var req dto.CreateLinkRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	res, err := l.linkService.Create(req)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, res)
}

func (l *LinkController) GetByUser(c *gin.Context) {
	userID, err := strconv.Atoi(c.Param("user_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	links, err := l.linkService.GetByUser(userID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, links)
}

func (l *LinkController) Redirect(c *gin.Context) {
	slug := c.Param("slug")

	originalURL, err := l.linkService.GetOriginalURL(c.Request.Context(), slug)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.Redirect(http.StatusMovedPermanently, originalURL)
}
