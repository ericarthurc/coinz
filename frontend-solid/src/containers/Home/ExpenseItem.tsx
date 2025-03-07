import { Component } from "solid-js";

import { Expense } from "@/types";
import { localizeDateToPST } from "@/utilities/date";
import budgetsStore from "@/stores/budgetsStore";

interface IProps {
  budgetId: number;
  expense: Expense;
}

const ExpenseItem: Component<IProps> = (props) => {
  const { deleteBudgetExpense } = budgetsStore;

  return (
    <div class="bc_exp_item">
      <div class="bc_exp_item_header">
        <span class="bc_exp_item_header_merchant">
          {props.expense.merchant}
        </span>
        <button
          onclick={() => deleteBudgetExpense(props.budgetId, props.expense.id)}
        >
          <svg
            class="bc_svg_icon bc_svg_remove"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-miterlimit="10"
              stroke-width="1.5"
              d="M8 12h8m6 0c0 5.523-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2s10 4.477 10 10"
            />
          </svg>
        </button>
      </div>
      <div class="bc_exp_item_info">
        <span class="bc_exp_item_info_date">
          {localizeDateToPST(props.expense.transaction_date)}
        </span>
        <span class="bc_exp_item_info_amount">{props.expense.amount}</span>
      </div>
    </div>
  );
};

export default ExpenseItem;
