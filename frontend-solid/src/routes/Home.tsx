import { Budget } from "@/types";
import { createResource, createSignal, For, type Component } from "solid-js";

const fetchMonthlyBudget = async () => {
  const response = await fetch(`/api/monthly-budgets`);
  return response.json();
};

const Home: Component = () => {
  const [budgetList, { mutate, refetch }] = createResource<Budget[]>(
    fetchMonthlyBudget,
    { initialValue: [], deferStream: true }
  );

  const [input, setInput] = createSignal("");

  async function addWe(e: Event) {
    e.preventDefault();

    // update the state optimistically
    mutate((budgetList) => {
      return [
        ...budgetList,
        {
          id: 10,
          category_id: 29,
          category_name: input(),
          budget_amount: 100,
          expenses: [],
          month: "2025-02-01",
        },
      ];
    });
    // perform the POST method in a try catch
  }

  return (
    <div>
      <For each={budgetList()}>
        {(budget, _index) => (
          <div style={"padding-bottom: 10px"}>
            <span>{budget.id}</span>
            <span>{budget.category_name}</span>
            <span>{budget.category_id}</span>
            <span>{budget.budget_amount}</span>
            <For each={budget.expenses}>
              {(expense, _index) => (
                <div>
                  <span>{expense.id}</span>
                  <span>{expense.amount}</span>
                  <span>{expense.merchant}</span>
                  <span>{expense.transaction_date}</span>
                </div>
              )}
            </For>
            <button onClick={() => refetch()}>Refresh Me</button>
            <form onSubmit={(e) => addWe(e)}>
              <input
                type="text"
                value={input()}
                onChange={(e) => setInput(e.target.value)}
              />
              <button type="submit">Add We</button>
            </form>
          </div>
        )}
      </For>
    </div>
  );
};

export default Home;
