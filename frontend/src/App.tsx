import { createResource, createSignal, For, type Component } from "solid-js";
import { DOMElement } from "solid-js/jsx-runtime";
import BudgetCard from "@/BudgetCard";

const fetcher = async () => {
  const response = await fetch(`/api`);
  return response.json();
};

const App: Component = () => {
  const [data, { mutate, refetch }] = createResource(fetcher, {
    initialValue: [],
  });

  async function addExpense(
    event: MouseEvent & {
      currentTarget: HTMLButtonElement;
      target: DOMElement;
    },
    budgetId: string,
    categoryId: string,
    data: { amount: number; store: string }
  ) {
    event.preventDefault();
    console.log(budgetId, categoryId);

    const value = {
      category_id: categoryId,
      monthly_budgets_id: budgetId,
      amount: data.amount,
      store: data.store,
    };

    try {
      const response = await fetch("/api/v1/expenses", {
        method: "POST",
        body: JSON.stringify(value),
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        throw new Error("bad request");
      }

      refetch();
    } catch (error) {
      console.log(error);
    }
    // mutate((prevData) => {
    //   return prevData.map((item) => {
    //     if (item.id == budgetId) {
    //       return { ...item, expenses: [...item.expenses, value] };
    //     }
    //     return item;
    //   });
    // });
  }

  return (
    <main>
      <h1>Coinz</h1>
      <div>
        <button onClick={() => refetch()}>Manual Refresh</button>
        <h2>
          {data()[1] &&
            new Date(data()[1]?.month).toLocaleDateString("default", {
              month: "long",
            })}
        </h2>

        <For each={data()} fallback={<div>Spin to Win!</div>}>
          {(entry, i) => <BudgetCard entry={entry} addExpense={addExpense} />}
        </For>
      </div>
    </main>
  );
};

export default App;
