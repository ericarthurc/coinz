import { Component } from "solid-js";
import { CloseIcon } from "~/icons/svgIcons";

const ExpenseCard: Component<{
  expense: any;
  deleteExpense: (event: any, exp_id: any) => void;
}> = (props) => {
  return (
    <div class="expense_card">
      <div class="box expense_card_box_1">
        <span class="expense_card_date">
          {`${new Date(props.expense.timestamp).toLocaleDateString()}`}
        </span>
      </div>

      <div class="box expense_card_box_2">
        <span class="expense_card_store">{props.expense.store}</span>
      </div>

      <div class="box expense_card_box_3">
        <span class="expense_card_amount">${props.expense.amount}</span>
        <button
          onClick={(e) => props.deleteExpense(e, props.expense.id)}
          class="expense_card_button_add"
        >
          <CloseIcon />
        </button>
      </div>
    </div>
  );
};

export default ExpenseCard;
