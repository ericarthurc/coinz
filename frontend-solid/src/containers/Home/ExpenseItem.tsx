import { Component } from "solid-js";
import { createStore } from "solid-js/store";

import { Expense } from "@/types";
import budgetsStore from "@/stores/budgetsStore";

interface IProps {
  expense: Expense;
}

const ExpenseItem: Component<IProps> = (props) => {
  const { createBudgetExpense } = budgetsStore;

  const [formData, setFormData] = createStore<{ merchant: string }>({
    merchant: "",
  });

  return (
    <div>
      <span>{props.expense.id}</span>
      <span>{props.expense.amount}</span>
      <span>{props.expense.merchant}</span>
      <span>{props.expense.transaction_date}</span>
      <form onSubmit={(e) => createBudgetExpense(e, formData)}>
        <input
          type="text"
          value={formData.merchant}
          onChange={(e) => setFormData("merchant", e.currentTarget.value)}
        />
        <button type="submit">Add Expense</button>
      </form>
    </div>
  );
};

export default ExpenseItem;
