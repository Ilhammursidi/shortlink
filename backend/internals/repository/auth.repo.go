package repository

import (
	"context"

	"github.com/ilhammursidi/shortlink/internals/dto"
	"github.com/jackc/pgx/v5/pgxpool"
)

type AuthRepository struct {
	db *pgxpool.Pool
}

func NewAuthRepository(db *pgxpool.Pool) *AuthRepository {
	return &AuthRepository{db: db}
}

func (r *AuthRepository) CreateUser(name, email, hashedPassword string) error {
	query := `INSERT INTO users (name, email, password) VALUES ($1, $2, $3)`
	_, err := r.db.Exec(context.Background(), query, name, email, hashedPassword)
	return err
}

func (r *AuthRepository) FindByEmail(email string) (*dto.UserResponse, string, error) {
	query := `SELECT id, name, email, password, COALESCE(picture, ''), TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') FROM users WHERE email = $1`
	row := r.db.QueryRow(context.Background(), query, email)

	var user dto.UserResponse
	var password string
	err := row.Scan(&user.ID, &user.Name, &user.Email, &password, &user.Picture, &user.CreatedAt)
	if err != nil {
		return nil, "", err
	}
	return &user, password, nil
}
