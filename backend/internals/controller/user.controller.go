package controller

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/ilhammursidi/shortlink/internals/dto"
	"github.com/ilhammursidi/shortlink/internals/services"
)

type UserController struct {
	userService *services.UserService
}

func NewUserController(userService *services.UserService) *UserController {
	return &UserController{userService: userService}
}

func (u *UserController) UploadPicture(c *gin.Context) {
	userID, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, dto.ErrorResponse("invalid user id"))
		return
	}

	file, err := c.FormFile("picture")
	if err != nil {
		c.JSON(http.StatusBadRequest, dto.ErrorResponse("picture is required"))
		return
	}

	picturePath, err := u.userService.UploadPicture(userID, file)
	if err != nil {
		c.JSON(http.StatusInternalServerError, dto.ErrorResponse(err.Error()))
		return
	}

	c.JSON(http.StatusOK, dto.SuccessResponse("Picture uploaded successfully", gin.H{
		"picture": picturePath,
	}))
}
