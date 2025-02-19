package dto

import (
	"coinz/internal/database"
	"context"
	"fmt"
	"maps"
	"slices"
	"sort"
	"time"
)

type DtoExpense struct {
	Id               int       `json:"id"`
	ExpenseSpent     float64   `json:"expense_spent"`
	ExpenseTimestamp time.Time `json:"expense_timestamp"`
	Store            string    `json:"store"`
}

type DtoBudget struct {
	Id             int          `json:"id"`
	BudgetAmount   float64      `json:"budget_amount"`
	CategoryAmount float64      `json:"category_amount"`
	CategoryName   string       `json:"category_name"`
	Month          string       `json:"month"`
	Expenses       []DtoExpense `json:"expenses"`
}

func GetAllMonthlyBudgetsDTO(dbp *database.DbPool) ([]*DtoBudget, error) {
	query := `SELECT budget.id as budget_id, budget.budget_amount as budget_amount, budget.month as budget_month, category.id as category_id, category.amount as category_amount, category.name as category_name, expense.id as expense_id, expense.spent as expense_spent, expense.store as expense_store, expense.timestamp as expense_timestamp FROM budget LEFT JOIN expense on budget.id = expense.budget_id LEFT JOIN category ON budget.category_id = category.id ORDER BY budget.id, category.name;`

	rows, err := dbp.Query(context.Background(), query)
	if err != nil {
		return nil, fmt.Errorf("unable to query users: %w", err)
	}
	defer rows.Close()

	dtoBudgetMap := make(map[int]*DtoBudget)

	for rows.Next() {
		var budgetId int
		var budgetAmount float64
		var budgetMonth string
		var categoryId int
		var categoryAmount float64
		var categoryName string
		var expenseId *int
		var expenseSpent *float64
		var expenseStore *string
		var expenseTimestamp *time.Time

		err := rows.Scan(&budgetId, &budgetAmount, &budgetMonth, &categoryId, &categoryAmount, &categoryName, &expenseId, &expenseSpent, &expenseStore, &expenseTimestamp)
		if err != nil {
			return nil, err
		}

		if _, exists := dtoBudgetMap[budgetId]; !exists {
			dtoBudgetMap[budgetId] = &DtoBudget{
				Id:             budgetId,
				BudgetAmount:   budgetAmount,
				CategoryAmount: categoryAmount,
				CategoryName:   categoryName,
				Month:          budgetMonth,
				Expenses:       []DtoExpense{},
			}
		}

		if expenseId != nil {
			dtoBudgetMap[budgetId].Expenses = append(dtoBudgetMap[budgetId].Expenses, DtoExpense{
				Id:               *expenseId,
				ExpenseSpent:     *expenseSpent,
				ExpenseTimestamp: *expenseTimestamp,
				Store:            *expenseStore,
			})
		}
	}

	result := slices.Collect(maps.Values(dtoBudgetMap))

	sort.Slice(result, func(i, j int) bool {
		if result[i].CategoryAmount == result[j].CategoryAmount {
			return result[i].CategoryName < result[j].CategoryName
		}
		return result[i].BudgetAmount > result[j].BudgetAmount
	})

	for _, budget := range result {
		sort.Slice(budget.Expenses, func(i, j int) bool {
			return budget.Expenses[i].ExpenseTimestamp.Unix() < budget.Expenses[j].ExpenseTimestamp.Unix()
		})
	}

	return result, nil
}
