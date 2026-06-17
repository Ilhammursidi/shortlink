package services

import (
	"fmt"
	"mime/multipart"
	"os"
	"path/filepath"
	"time"

	"github.com/ilhammursidi/shortlink/internals/repository"
)

type UserService struct {
	repo *repository.UserRepository
}

func NewUserService(repo *repository.UserRepository) *UserService {
	return &UserService{repo: repo}
}

func (s *UserService) UploadPicture(userID int, file *multipart.FileHeader) (string, error) {
	ext := filepath.Ext(file.Filename)
	filename := fmt.Sprintf("user_%d_%d%s", userID, time.Now().Unix(), ext)
	savePath := filepath.Join("uploads", filename)

	src, err := file.Open()
	if err != nil {
		return "", err
	}
	defer src.Close()

	dst, err := os.Create(savePath)
	if err != nil {
		return "", err
	}
	defer dst.Close()

	_, err = dst.ReadFrom(src)
	if err != nil {
		return "", err
	}

	picturePath := "/uploads/" + filename
	err = s.repo.UpdatePicture(userID, picturePath)
	if err != nil {
		return "", err
	}
	return picturePath, nil
}
