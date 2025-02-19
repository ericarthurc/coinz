import type { IDtoBudget } from "@/types";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

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

      await getBudgets();
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteExpense(expenseId: number) {
    try {
      const response = await fetch(`/api/expense/${expenseId}`, {
        method: "DELETE",
      });

      await getBudgets();
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
