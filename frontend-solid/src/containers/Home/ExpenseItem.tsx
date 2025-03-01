import { Component } from "solid-js";
import { format } from "date-fns";
import { tz } from "@date-fns/tz";

import { Expense } from "@/types";

interface IProps {
  expense: Expense;
}

const ExpenseItem: Component<IProps> = (props) => {
  return (
    <div class="bc_exp_item">
      <div class="bc_exp_item_header">
        <span class="bc_exp_item_header_merchant">
          {props.expense.merchant}
        </span>
        <button class="">
          <svg
            class=""
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
          >
            <path
              fill="#fff"
              stroke="#232112"
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
          {format(props.expense.transaction_date, "LLL dd, yyyy", {
            in: tz("America/Los_Angeles"),
          })}
        </span>
        <span class="bc_exp_item_info_amount">{props.expense.amount}</span>
      </div>
    </div>
  );
};

export default ExpenseItem;
