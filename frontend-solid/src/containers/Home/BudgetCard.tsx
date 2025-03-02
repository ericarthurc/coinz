import { Component, For } from "solid-js";
import { createStore } from "solid-js/store";

import { Budget } from "@/types";
import ExpenseItem from "./ExpenseItem";
import budgetsStore from "@/stores/budgetsStore";

interface IProps {
  budget: Budget;
}

const BudgetCard: Component<IProps> = (props) => {
  const { createBudgetExpense } = budgetsStore;

  const [formData, setFormData] = createStore<{ merchant: string }>({
    merchant: "",
  });

  return (
    <div class="bc">
      <div class="bc_header">
        <span class="bc_header_spacer"></span>
        <span class="bc_header_category">{props.budget.category_name}</span>
        <span class="bc_header_amount">
          Budgeted: {props.budget.budget_amount}
        </span>
      </div>
      <div class="bc_exp">
        <For each={props.budget.expenses}>
          {(expense, _index) => <ExpenseItem expense={expense} />}
        </For>
      </div>
      <form onSubmit={(e) => createBudgetExpense(e, formData)}>
        <input
          type="text"
          required
          value={formData.merchant}
          onChange={(e) => setFormData("merchant", e.currentTarget.value)}
        />
        <button class="button_hidden_svg" type="submit">
          <svg
            class="bc_svg_add"
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
              d="M8 12h8m-4 4V8m10 4c0 5.523-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2s10 4.477 10 10"
            />
          </svg>
        </button>
      </form>
      <div class="bc_footer"></div>
    </div>
  );
};

export default BudgetCard;
