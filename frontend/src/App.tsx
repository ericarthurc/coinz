import { createResource, createSignal, For, type Component } from "solid-js";
import { DOMElement } from "solid-js/jsx-runtime";

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

  function calculateSpent(entry: any): number {
    let spent = 0;

    for (const element of entry.expenses) {
      spent += parseInt(element.amount);
    }

    return spent;
  }

  function calculateRemaining(entry: any): number {
    let total = entry.categories.amount;

    for (const element of entry.expenses) {
      total -= parseInt(element.amount);
    }

    return total;
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
          {(entry, i) => (
            <div
              style={
                "margin-bottom: 15px; border-radius: 0.5rem; border: 1px solid #a146c2; padding: 10px 10px; background:#19141b;"
              }
            >
              <div style={"margin-bottom: 10px"}>
                <span style={"font-weight: bold; margin-right: 10px"}>
                  {entry.categories.name.charAt(0).toUpperCase() +
                    entry.categories.name.slice(1)}
                </span>
                <span style={"color: #629feb"}>
                  Budget: {entry.categories.amount}
                </span>
              </div>
              <For each={entry.expenses}>
                {(expense, i) => (
                  <div
                    style={
                      "margin-bottom: 5px; border-radius: 0.5rem; border: 1px solid white;padding: 5px 10px;"
                    }
                  >
                    <span>
                      {`${new Date(expense.timestamp).toLocaleDateString()}`} |{" "}
                    </span>
                    <span>{expense.store} | </span>
                    <span>$</span>
                    <span style={"color: #ce423a"}>{expense.amount}</span>
                    <button>X</button>
                  </div>
                )}
              </For>
              <ExpenseForm entry={entry} addExpense={addExpense} />
              <span>Spent: {calculateSpent(entry).toString()} | </span>
              <span>Remaining: {calculateRemaining(entry).toString()}</span>
            </div>
          )}
        </For>
      </div>
    </main>
  );
};

const ExpenseForm: Component<{
  entry: any;
  addExpense: (
    event: any,
    bud_id: any,
    cat_id: any,
    data: { store: string; amount: number }
  ) => void;
}> = (props) => {
  const [store, setStore] = createSignal("");
  const [amount, setAmount] = createSignal("");

  return (
    <form>
      <label for="amount">Amount:</label>
      <input
        id="amount"
        type="number"
        value={amount()}
        onChange={(e) => setAmount(e.currentTarget.value)}
      />
      <label for="store">Store:</label>
      <input
        id="store"
        type="text"
        value={store()}
        onChange={(e) => setStore(e.currentTarget.value)}
      />
      <button
        type="submit"
        onClick={(e) =>
          props.addExpense(e, props.entry.id, props.entry.category_id, {
            store: store(),
            amount: parseInt(amount()),
          })
        }
      >
        Add expense
      </button>
    </form>
  );
};

export default App;
