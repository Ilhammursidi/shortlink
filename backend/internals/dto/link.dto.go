package dto

type CreateLinkRequest struct {
	UserID      int    `json:"user_id" db:"user_id"`
	OriginalURL string `json:"original_url" db:"original_url"`
	Slug        string `json:"slug" db:"slug"`
}

type LinkResponse struct {
	ID          int    `json:"id"`
	OriginalURL string `json:"original_url"`
	Slug        string `json:"slug"`
	ShortURL    string `json:"short_url"`
	CreatedAt   string `json:"created_at"`
}
