package model

import (
	"coinz/internal/database"
	"context"
	"fmt"
	"maps"
	"slices"
	"sort"
	"time"
)

type DateString string

func (d *DateString) Scan(src any) error {
	if t, ok := src.(time.Time); ok {
		*d = DateString(t.Format("2006-01-02"))
	} else if s, ok := src.(string); ok {
		*d = DateString(s)
	}
	return nil
}

type DtoExpense struct {
	Id              int        `json:"id"`
	Amount          float64    `json:"amount"`
	Merchant        string     `json:"merchant"`
	TransactionDate DateString `json:"transaction_date"`
}

type DtoBudget struct {
	Id           int          `json:"id"`
	CategoryId   int          `json:"category_id"`
	CategoryName string       `json:"category_name"`
	BudgetAmount float64      `json:"budget_amount"`
	Month        DateString   `json:"month"`
	Expenses     []DtoExpense `json:"expenses"`
}

func GetAllMonthlyBudgetsDTO(dbp *database.DbPool) ([]*DtoBudget, error) {
	query := `SELECT monthly_budgets.id, categories.id, categories.name, monthly_budgets.budget_amount, monthly_budgets.month, expenses.id, expenses.amount, expenses.merchant, expenses.transaction_date FROM monthly_budgets LEFT JOIN expenses on monthly_budgets.id = expenses.monthly_budget_id LEFT JOIN categories ON monthly_budgets.category_id = categories.id ORDER BY monthly_budgets.id, categories.name;`

	rows, err := dbp.Query(context.Background(), query)
	if err != nil {
		return nil, fmt.Errorf("unable to query users: %w", err)
	}
	defer rows.Close()

	dtoBudgetMap := make(map[int]*DtoBudget)

	for rows.Next() {
		var budgetId int
		var categoryId int
		var categoryName string
		var budgetAmount float64
		var budgetMonth DateString
		var expenseId *int
		var expenseAmount *float64
		var expenseMerchant *string
		var expenseTransactionDate *DateString

		err := rows.Scan(&budgetId, &categoryId, &categoryName, &budgetAmount, &budgetMonth, &expenseId, &expenseAmount, &expenseMerchant, &expenseTransactionDate)
		if err != nil {
			return nil, err
		}

		if _, exists := dtoBudgetMap[budgetId]; !exists {
			dtoBudgetMap[budgetId] = &DtoBudget{
				Id:           budgetId,
				CategoryId:   categoryId,
				CategoryName: categoryName,
				BudgetAmount: budgetAmount,
				Month:        budgetMonth,
				Expenses:     []DtoExpense{},
			}
		}

		if expenseId != nil {
			dtoBudgetMap[budgetId].Expenses = append(dtoBudgetMap[budgetId].Expenses, DtoExpense{
				Id:              *expenseId,
				Amount:          *expenseAmount,
				Merchant:        *expenseMerchant,
				TransactionDate: *expenseTransactionDate,
			})
		}
	}

	result := slices.Collect(maps.Values(dtoBudgetMap))

	sort.Slice(result, func(i, j int) bool {
		if result[i].BudgetAmount == result[j].BudgetAmount {
			return result[i].CategoryName < result[j].CategoryName
		}
		return result[i].BudgetAmount > result[j].BudgetAmount
	})

	for _, budget := range result {
		sort.Slice(budget.Expenses, func(i, j int) bool {
			return budget.Expenses[i].TransactionDate < budget.Expenses[j].TransactionDate
		})
	}

	return result, nil
}
