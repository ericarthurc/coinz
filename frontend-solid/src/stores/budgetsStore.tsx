import { Budget, Expense } from "@/types";
import { createResource, createRoot } from "solid-js";

const fetchMonthlyBudget = async () => {
  const response = await fetch(`/api/monthly-budgets`);
  return response.json();
};

function budgetsStore() {
  const [budgetList, { mutate, refetch }] = createResource<Budget[]>(
    fetchMonthlyBudget,
    { initialValue: [], deferStream: true }
  );

  function totalSpentOverall() {
    return budgetList()
      .map((b) => b.expenses.reduce((acc, curr) => acc + curr.amount, 0))
      .reduce((a, b) => a + b, 0);
  }

  function totalSpentByBudget(budgetId: number) {
    return budgetList()
      .find((b) => b.id == budgetId)!
      .expenses.reduce((acc, curr) => acc + curr.amount, 0);
  }

  function remainingBalanceByBudget(budgetId: number) {
    return (
      budgetList().find((b) => b.id == budgetId)!.budget_amount -
      totalSpentByBudget(budgetId)
    );
  }

  async function createBudgetExpense(
    e: Event,
    formData: {
      amount: number;
      merchant: string;
      date: string;
    },
    budgetId: number
  ) {
    e.preventDefault();

    const budgetIndex = budgetList().findIndex((b) => b.id == budgetId);
    const randomId = Math.floor(Math.random() * 10000);

    // Optimistic update to state
    mutate((prev) => {
      if (!prev) return prev;

      const newBudgetList = [...prev];

      newBudgetList[budgetIndex] = {
        ...newBudgetList[budgetIndex],
        expenses: [
          ...newBudgetList[budgetIndex].expenses,
          {
            id: randomId,
            amount: formData.amount,
            merchant: formData.merchant,
            transaction_date: formData.date,
          },
        ],
      };
      return newBudgetList;
    });

    try {
      const response = await fetch("/api/expense", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          monthly_budget_id: budgetId,
          amount: formData.amount,
          merchant: formData.merchant,
          transaction_date: formData.date,
        }),
      });

      if (!response.ok) {
        throw new Error("bad response");
      }

      const backendExpense = (await response.json()) as Expense;

      mutate((prev) => {
        if (!prev) return prev;

        const newBudgetList = [...prev];
        const budgetToUpdate = newBudgetList[budgetIndex];

        const expenseIndex = budgetToUpdate.expenses.findIndex(
          (e) => e.id === randomId
        );

        const updatedExpenses = [...budgetToUpdate.expenses];
        updatedExpenses[expenseIndex] = backendExpense;

        newBudgetList[budgetIndex] = {
          ...budgetToUpdate,
          expenses: updatedExpenses,
        };

        return newBudgetList;
      });
    } catch (error) {
      mutate((prev) => {
        if (!prev) return prev;

        const newBudgetList = [...prev];
        const budgetToUpdate = newBudgetList[budgetIndex];

        const updatedExpenses = budgetToUpdate.expenses.filter(
          (expense) => expense.id !== randomId
        );

        newBudgetList[budgetIndex] = {
          ...budgetToUpdate,
          expenses: updatedExpenses,
        };

        return newBudgetList;
      });
    }
  }

  async function deleteBudgetExpense(budgetId: number, expenseId: number) {
    const budgetIndex = budgetList().findIndex((b) => b.id == budgetId);

    mutate((prev) => {
      if (!prev) return prev;

      const newBudgetList = [...prev];
      const budgetToUpdate = newBudgetList[budgetIndex];

      const updatedExpenses = budgetToUpdate.expenses.filter(
        (expense) => expense.id !== expenseId
      );

      newBudgetList[budgetIndex] = {
        ...budgetToUpdate,
        expenses: updatedExpenses,
      };

      return newBudgetList;
    });

    try {
      const response = await fetch(`/api/expense/${expenseId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("bad response");
      }

      // resync data just in case
      refetch();
    } catch (error) {
      // handle error, needs to put the expense item back??
    }
  }

  return {
    budgetList,
    mutate,
    refetch,
    createBudgetExpense,
    deleteBudgetExpense,
    totalSpentOverall,
    totalSpentByBudget,
    remainingBalanceByBudget,
  };
}

export default createRoot(budgetsStore);
