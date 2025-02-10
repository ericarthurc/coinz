import { Component, createSignal } from "solid-js";

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
    <form class="expense_adder">
      <label for="amount">Spent:</label>
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
        +
      </button>
    </form>
  );
};

export default ExpenseForm;
