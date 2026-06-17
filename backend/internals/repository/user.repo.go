package repository

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
)

type UserRepository struct {
	db *pgxpool.Pool
}

func NewUserRepository(db *pgxpool.Pool) *UserRepository {
	return &UserRepository{db: db}
}

func (r *UserRepository) UpdatePicture(userID int, picturePath string) error {
	query := `UPDATE users SET picture = $1 WHERE id = $2`
	_, err := r.db.Exec(context.Background(), query, picturePath, userID)
	return err
}
