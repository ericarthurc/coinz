import { Budget } from "@/types";
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

  async function createBudgetExpense(e: Event, formData: any) {
    e.preventDefault();

    // update the state optimistically
    mutate((budgetList) => {
      return [
        ...budgetList,
        {
          id: 10,
          category_id: 29,
          category_name: "taco",
          budget_amount: 100,
          expenses: [
            {
              id: 1,
              amount: 10,
              merchant: formData.merchant,
              transaction_date: "q2w12",
            },
          ],
          month: "2025-02-01",
        },
      ];
    });
    // perform the POST method in a try catch
  }

  return { budgetList, mutate, refetch, createBudgetExpense };
}

export default createRoot(budgetsStore);
