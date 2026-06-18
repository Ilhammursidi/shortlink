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
		c.JSON(http.StatusBadRequest, dto.ErrorResponse(err.Error()))
		return
	}
	resp, err := l.linkService.Create(req)
	if err != nil {
		c.JSON(http.StatusBadRequest, dto.ErrorResponse(err.Error()))
		return
	}
	c.JSON(http.StatusCreated, dto.SuccessResponse("Link created successfully", resp))
}

func (l *LinkController) GetByUser(c *gin.Context) {
	userID, err := strconv.Atoi(c.Param("user_id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, dto.ErrorResponse("invalid user id"))
		return
	}
	links, err := l.linkService.GetByUser(userID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse(err.Error()))
		return
	}
	c.JSON(http.StatusOK, dto.SuccessResponse("Links retrieved successfully", links))
}

func (l *LinkController) Delete(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, dto.ErrorResponse("invalid id"))
		return
	}

	slug := c.Param("slug")

	if err := l.linkService.DeleteLink(id, slug); err != nil {
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse(err.Error()))
		return
	}
	c.JSON(http.StatusOK, dto.SuccessResponse("Link deleted successfully", nil))
}

func (l *LinkController) Redirect(c *gin.Context) {
	slug := c.Param("slug")
	originalURL, err := l.linkService.GetOriginalURL(c.Request.Context(), slug)
	if err != nil {
		c.JSON(http.StatusNotFound, dto.ErrorResponse("link not found"))
		return
	}
	c.Redirect(http.StatusMovedPermanently, originalURL)
}
