import { Component } from "solid-js";

const ExpenseCard: Component<{ expense: any }> = (props) => {
  return (
    <div class="expense_card">
      <span>
        {`${new Date(props.expense.timestamp).toLocaleDateString()}`} |{" "}
      </span>
      <span>{props.expense.store} | </span>
      <span class="amount">${props.expense.amount}</span>
      <button>x</button>
    </div>
  );
};

export default ExpenseCard;
