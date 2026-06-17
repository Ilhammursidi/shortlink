package services

import (
	"context"
	"errors"
	"os"

	"github.com/ilhammursidi/shortlink/internals/dto"
	"github.com/ilhammursidi/shortlink/internals/repository"
)

type LinkService struct {
	repo *repository.LinkRepository
}

func NewLinkService(repo *repository.LinkRepository) *LinkService {
	return &LinkService{repo: repo}
}

func (s *LinkService) Create(req dto.CreateLinkRequest) (*dto.LinkResponse, error) {
	err := s.repo.Create(req.UserID, req.OriginalURL, req.Slug)
	if err != nil {
		return nil, errors.New("slug already exists or invalid input")
	}

	return &dto.LinkResponse{
		OriginalURL: req.OriginalURL,
		Slug:        req.Slug,
		ShortURL:    os.Getenv("BACKEND_URL") + "/" + req.Slug,
	}, nil
}

func (s *LinkService) GetByUser(userID int) ([]dto.LinkResponse, error) {
	links, err := s.repo.FindByUser(userID)
	if err != nil {
		return nil, err
	}

	for i := range links {
		links[i].ShortURL = os.Getenv("BACKEND_URL") + "/" + links[i].Slug
	}

	return links, nil
}

func (s *LinkService) GetOriginalURL(ctx context.Context, slug string) (string, error) {
	url, err := s.repo.FindBySlug(ctx, slug)
	if err != nil {
		return "", errors.New("link not found")
	}
	return url, nil
}
