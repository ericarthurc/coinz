package model

import (
	"time"
)

type Post struct {
	Xata_id        string    `json:"xata_id"`
	Xata_version   int       `json:"xata_version"`
	Xata_createdat time.Time `json:"xata_createdat"`
	Xata_updatedat time.Time `json:"xata_updatedat"`
	Title          string    `json:"title"`
	Slug           string    `json:"slug"`
	Content        string    `json:"content"`
	Date           time.Time `json:"date"`
	Published      bool      `json:"published"`
	Featured       bool      `json:"featured"`
	Snippet        string    `json:"snippet"`
	Categories     []string  `json:"categories"`
	Skills         []string  `json:"skills"`
	Views          int       `json:"views"`
}

type MonthlyBudget struct {
	Id          int    `json:"id"`
	Category_id int    `json:"category_id"`
	Month       string `json:"month"`
}

type Expense struct {
	Id          int       `json:"id"`
	Budget_id   int       `json:"budget_id"`
	Category_id int       `json:"category_id"`
	Spent       float64   `json:"expense_spent"`
	Store       string    `json:"store"`
	Timestamp   time.Time `json:"expense_timestamp"`
}

type Category struct {
	Id         int       `json:"id"`
	Name       string    `json:"name"`
	Amount     float64   `json:"amount"`
	Created_at time.Time `json:"created_at"`
}

// func GetAllPosts(dbp *database.DbPool) ([]Post, error) {
// 	query := `SELECT * FROM posts`

// 	rows, err := dbp.Query(context.Background(), query)
// 	if err != nil {
// 		return nil, fmt.Errorf("unable to query posts: %w", err)
// 	}
// 	defer rows.Close()

// 	return pgx.CollectRows(rows, pgx.RowToStructByName[Post])
// }

// func GetPostBySlug(dbp *database.DbPool, slug string) (Post, error) {
// 	query := `SELECT * FROM posts WHERE slug = (@slug)`
// 	args := pgx.NamedArgs{"slug": slug}

// 	rows, err := dbp.Query(context.Background(), query, args)
// 	if err != nil {
// 		return Post{}, fmt.Errorf("unable to query post: %w", err)
// 	}
// 	defer rows.Close()

// 	return pgx.CollectOneRow(rows, pgx.RowToStructByName[Post])
// }

// func GetPostByID(dbp *database.DbPool, xata_id string) (Post, error) {
// 	query := `SELECT * FROM posts WHERE xata_id = (@xata_id)`
// 	args := pgx.NamedArgs{"xata_id": xata_id}

// 	rows, err := dbp.Query(context.Background(), query, args)
// 	if err != nil {
// 		return Post{}, fmt.Errorf("unable to query post: %w", err)
// 	}
// 	defer rows.Close()

// 	return pgx.CollectOneRow(rows, pgx.RowToStructByName[Post])
// }

// func CreatePost(dbp *database.DbPool, post Post) error {
// 	query := `INSERT INTO posts (title, slug, content, date, published, featured, snippet, categories, skills) VALUES (@title, @slug, @content, @date, @published, @featured, @snippet, @categories, @skills)`
// 	args := pgx.NamedArgs{
// 		"title":      post.Title,
// 		"slug":       post.Slug,
// 		"content":    post.Content,
// 		"date":       post.Date,
// 		"published":  post.Published,
// 		"featured":   post.Featured,
// 		"snippet":    post.Snippet,
// 		"categories": post.Categories,
// 		"skills":     post.Skills,
// 	}

// 	_, err := dbp.Exec(context.Background(), query, args)
// 	if err != nil {
// 		return fmt.Errorf("unable to insert row: %w", err)
// 	}

// 	return nil
// }

// func UpdatePost(dbp *database.DbPool, post Post) error {
// 	query := `UPDATE posts SET title = @title, slug = @slug, content = @content, date = @date, published = @published, featured = @featured, snippet = @snippet, categories = @categories, skills = @skills WHERE xata_id = @xata_id`
// 	args := pgx.NamedArgs{
// 		"xata_id":    post.Xata_id,
// 		"title":      post.Title,
// 		"slug":       post.Slug,
// 		"content":    post.Content,
// 		"date":       post.Date,
// 		"published":  post.Published,
// 		"featured":   post.Featured,
// 		"snippet":    post.Snippet,
// 		"categories": post.Categories,
// 		"skills":     post.Skills,
// 	}

// 	_, err := dbp.Exec(context.Background(), query, args)
// 	if err != nil {
// 		return fmt.Errorf("unable to update row: %w", err)
// 	}

// 	return nil
// }
