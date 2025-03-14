package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"

	"coinz/internal/controller/api/budget"
	"coinz/internal/database"
	"coinz/internal/model"
	"coinz/internal/orbit"

	"github.com/go-chi/chi/v5"
	chiMiddleware "github.com/go-chi/chi/v5/middleware"
	"github.com/jackc/pgx/v5"
	"github.com/joho/godotenv"
)

func main() {
	// load .env variables
	err := godotenv.Load()
	if err != nil {
		log.Fatal("error loading .env file")
	}

	// initialize database pool
	dbPool, err := database.NewDbPool()
	if err != nil {
		log.Fatal(err)
	}

	// initialize orbit
	orb := orbit.NewOrbit()
	r := chi.NewRouter()

	// root level middleware stack
	r.Use(chiMiddleware.RealIP)
	// r.Use(middleware.Logger)
	r.Use(chiMiddleware.Recoverer)

	// serve static files
	// r.Get("/favicon.ico", func(w http.ResponseWriter, r *http.Request) {
	// 	http.ServeFile(w, r, "web/root/favicon.ico")
	// })
	// r.Get("/robots.txt", func(w http.ResponseWriter, r *http.Request) {
	// 	http.ServeFile(w, r, "web/root/robots.txt")
	// })
	// r.Handle("/static/*", http.StripPrefix("/static/", http.FileServer(http.Dir("web/static"))))

	// row := dbPool.Pool.QueryRow(context.Background(), "SELECT month FROM monthly_budgets")
	// if err != nil {
	// 	fmt.Println(err)
	// }

	// var txDate model.DateString
	// err = row.Scan(&txDate)
	// if err != nil {
	// 	fmt.Println(err)
	// }
	// fmt.Println(txDate)

	r.Post("/api/expense", func(w http.ResponseWriter, r *http.Request) {

		type FormData struct {
			MonthlyBudgetId int     `json:"monthly_budget_id"`
			Amount          float64 `json:"amount"`
			Merchant        string  `json:"merchant"`
			TransactionDate string  `json:"transaction_date"`
		}

		var data FormData
		err := json.NewDecoder(r.Body).Decode(&data)
		if err != nil {
			http.Error(w, err.Error(), 500)
			return
		}

		rows, err := dbPool.Pool.Query(context.Background(), `INSERT INTO expenses (amount, merchant, monthly_budget_id, transaction_date) VALUES (@amount, @merchant, @monthly_budget_id, @transaction_date) RETURNING *;`, pgx.NamedArgs{
			"amount":            data.Amount,
			"merchant":          data.Merchant,
			"monthly_budget_id": data.MonthlyBudgetId,
			"transaction_date":  data.TransactionDate,
		})
		if err != nil {
			http.Error(w, err.Error(), 500)
			return
		}

		expense, err := pgx.CollectOneRow(rows, pgx.RowToStructByName[model.Expense])
		if err != nil {
			http.Error(w, err.Error(), 500)
			return
		}

		orb.JSON(w, 200, expense)
	})

	r.Delete("/api/expense/{id}", func(w http.ResponseWriter, r *http.Request) {
		id := chi.URLParam(r, "id")

		_, err = dbPool.Pool.Exec(context.Background(), `DELETE FROM expenses WHERE expenses.id = (@id)`, pgx.NamedArgs{
			"id": id,
		})
		if err != nil {
			http.Error(w, err.Error(), 500)
			return
		}

		orb.JSON(w, 200, "okay")
	})

	// routes
	r.Group(func(r chi.Router) {

		r.Mount("/api/monthly-budgets", budget.Routes(dbPool, orb))
	})

	orbit.Launch(r)
}
