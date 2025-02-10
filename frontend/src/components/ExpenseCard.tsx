import { Component } from "solid-js";

const ExpenseCard: Component<{ expense: any }> = (props) => {
  return (
    <div class="expense_card">
      <span class="expense_card_date">
        {`${new Date(props.expense.timestamp).toLocaleDateString()}`}
      </span>

      <span class="expense_card_store">{props.expense.store}</span>

      <div class="expense_card_box_3">
        <span class="expense_card_amount">${props.expense.amount}</span>
        <button class="expense_card_button_add">x</button>
      </div>
    </div>
  );
};

export default ExpenseCard;
