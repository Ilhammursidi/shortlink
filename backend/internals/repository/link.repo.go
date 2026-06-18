package repository

import (
	"context"
	"time"

	"github.com/ilhammursidi/shortlink/internals/dto"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/redis/go-redis/v9"
)

type LinkRepository struct {
	db  *pgxpool.Pool
	rdb *redis.Client
}

func NewLinkRepository(db *pgxpool.Pool, rdb *redis.Client) *LinkRepository {
	return &LinkRepository{db: db, rdb: rdb}
}

func (r *LinkRepository) Create(userID int, originalURL, slug string) error {
	query := `INSERT INTO links (user_id, original_url, slug) VALUES ($1,$2,$3)`
	_, err := r.db.Exec(context.Background(), query, userID, originalURL, slug)
	return err
}

func (r *LinkRepository) FindByUser(userID int) ([]dto.LinkResponse, error) {
	query := `SELECT id, original_url, slug, TO_CHAR(created_at, 'YYYY-MM-DD HH24:MI:SS') 
	          FROM links WHERE user_id = $1 AND deleted_at IS NULL ORDER BY created_at DESC`

	rows, err := r.db.Query(context.Background(), query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var links []dto.LinkResponse
	for rows.Next() {
		var l dto.LinkResponse
		err := rows.Scan(&l.ID, &l.OriginalURL, &l.Slug, &l.CreatedAt)
		if err != nil {
			return nil, err
		}
		links = append(links, l)
	}
	if links == nil {
		links = []dto.LinkResponse{}
	}
	return links, nil
}

func (r *LinkRepository) FindBySlug(ctx context.Context, slug string) (string, error) {
	cached, err := r.rdb.Get(ctx, "slug:"+slug).Result()
	if err == nil {
		return cached, nil
	}

	query := `SELECT original_url FROM links WHERE slug = $1 AND deleted_at IS NULL`
	row := r.db.QueryRow(ctx, query, slug)

	var originalURL string
	err = row.Scan(&originalURL)
	if err != nil {
		return "", err
	}

	r.rdb.Set(ctx, "slug:"+slug, originalURL, 24*time.Hour)
	return originalURL, nil
}

func (r *LinkRepository) SoftDelete(id int) error {
	query := `UPDATE links SET deleted_at = NOW() WHERE id = $1`
	_, err := r.db.Exec(context.Background(), query, id)
	return err
}

func (r *LinkRepository) DeleteCache(ctx context.Context, slug string) error {
	// Menghapus key "slug:nama-slug" dari memory Redis
	return r.rdb.Del(ctx, "slug:"+slug).Err()
}
