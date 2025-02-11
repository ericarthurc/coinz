import { createResource, createSignal, For, type Component } from "solid-js";
import { DOMElement } from "solid-js/jsx-runtime";
import BudgetCard from "@/BudgetCard";

const monthMap: Record<string, string> = {
  one: "January",
  two: "February",
  three: "March",
  four: "April",
  five: "May",
  six: "June",
  seven: "July",
  eight: "August",
  nine: "September",
  ten: "October",
  eleven: "November",
  twelve: "December",
};

const fetcher = async (month: string, info: any) => {
  const queriedMonth = "two";

  console.log(info);

  const response = await fetch(`/api/v1/budget?month=${info.refetching}`);
  return response.json();
};

const App: Component = () => {
  // use a localStorage value to check what month to grab
  const [data, { mutate, refetch }] = createResource("", fetcher, {
    initialValue: [],
  });

  async function getManualMonth(month: string) {
    // set localStorage value here
    console.log(month);

    refetch(month);
  }

  async function deleteExpense(
    event: MouseEvent & {
      currentTarget: HTMLButtonElement;
      target: DOMElement;
    },
    expenseId: string
  ) {
    event.preventDefault();

    try {
      const response = await fetch(`/api/v1/expense/${expenseId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("bad request");
      }

      refetch("DELETER");
    } catch (error) {
      console.log(error);
    }
  }

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

      refetch("ADDER");
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
        <button onClick={() => getManualMonth("one")}>Jan</button>
        <button onClick={() => getManualMonth("two")}>Feb</button>
        <button onClick={() => getManualMonth("three")}>March</button>
      </div>
      <button onClick={() => refetch()}>Manual Refresh</button>
      <div class="main_container">
        <h2>{data()[0] && monthMap[data()[0].month]}</h2>

        <For
          each={data()}
          fallback={
            <>
              <h2>Month loading....</h2>
              <div class="budget_card"></div>
            </>
          }
        >
          {(entry, i) => (
            <BudgetCard
              entry={entry}
              addExpense={addExpense}
              deleteExpense={deleteExpense}
            />
          )}
        </For>
      </div>
    </main>
  );
};

export default App;
