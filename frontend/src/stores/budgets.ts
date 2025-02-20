import type { IDtoBudget } from "@/types";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useBudgetsStore = defineStore("budgets", () => {
  const budgetsArray = ref<IDtoBudget[]>([]);

  async function getBudgets() {
    const response = await fetch("/api/budget");

    budgetsArray.value = await response.json();
  }

  function calculateSpent(budgetId: number): number {
    const spent = budgetsArray.value
      .find((budget) => budget.id == budgetId)!
      .expenses.reduce((acc, curr) => acc + curr.expense_spent, 0);

    return spent;
  }

  function calculateRemaining(budgetId: number): number {
    const spent = calculateSpent(budgetId);

    return (
      budgetsArray.value.find((budget) => budget.id == budgetId)!
        .budget_amount - spent
    );
  }

  async function addExpenseToBudget(
    budgetId: number,
    spent: number,
    store: string
  ) {
    const budgetIndex = budgetsArray.value.findIndex((b) => b.id == budgetId);

    const randomId = Math.floor(Math.random() * 10000);

    budgetsArray.value.map((budget) => {
      if (budget.id == budgetId) {
        budget.expenses.push({
          id: randomId,
          expense_spent: spent,
          store: store,
          expense_timestamp: new Date(),
        });
      }
    });

    try {
      const response = await fetch("/api/expense", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ budgetId, spent, store }),
      });

      if (!response.ok) {
        throw new Error("bad response");
      }

      const newExpense = await response.json();

      const expenseIndex = budgetsArray.value[budgetIndex].expenses.findIndex(
        (e) => e.id == randomId
      );
      budgetsArray.value[budgetIndex].expenses[expenseIndex] = {
        ...budgetsArray.value[budgetIndex].expenses[expenseIndex],
        ...newExpense,
      };
    } catch (error) {
      budgetsArray.value[budgetIndex].expenses.splice(
        budgetsArray.value[budgetIndex].expenses.findIndex(
          (e) => e.id == randomId
        ),
        1
      );
    }
  }

  async function deleteExpense(budgetId: number, expenseId: number) {
    const budgetIndex = budgetsArray.value.findIndex((b) => b.id == budgetId);

    budgetsArray.value[budgetIndex].expenses.splice(
      budgetsArray.value[budgetIndex].expenses.findIndex(
        (e) => e.id == expenseId
      ),
      1
    );

    try {
      const response = await fetch(`/api/expense/${expenseId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("bad response");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return {
    budgetsArray,
    getBudgets,
    addExpenseToBudget,
    deleteExpense,
    calculateSpent,
    calculateRemaining,
  };
});

// budgetsArray.value.map((budget) => {
//   if (budget.id == budgetId) {
//     budget.expenses.push({
//       id: 0,
//       expense_amount: amount,
//       store: store,
//     });
//   }
// });
