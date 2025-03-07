import { Component, For } from "solid-js";
import { createStore } from "solid-js/store";

import { Budget } from "@/types";
import ExpenseItem from "./ExpenseItem";
import budgetsStore from "@/stores/budgetsStore";

interface IProps {
  budget: Budget;
}

const BudgetCard: Component<IProps> = (props) => {
  const { createBudgetExpense, totalSpentByBudget, remainingBalanceByBudget } =
    budgetsStore;

  const [formData, setFormData] = createStore<{
    amount: number;
    merchant: string;
    date: string;
  }>({
    amount: NaN,
    merchant: "",
    date: new Date().toDateString(),
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
          {(expense, _index) => (
            <ExpenseItem budgetId={props.budget.id} expense={expense} />
          )}
        </For>
      </div>
      <div class="bc_form_container">
        <form
          class="bc_form_container_form"
          onSubmit={(e) => createBudgetExpense(e, formData, props.budget.id)}
        >
          <label for="">Merchant:</label>
          <input
            type="text"
            required
            value={formData.merchant}
            onChange={(e) => setFormData("merchant", e.currentTarget.value)}
          />
          <label for="">Spent:</label>
          <input
            name=""
            type="number"
            step="0.01"
            required
            value={formData.amount}
            onChange={(e) =>
              setFormData("amount", parseFloat(e.currentTarget.value))
            }
          />
          <label for="">Date:</label>
          <input
            type="date"
            required
            value={formData.date}
            onChange={(e) => setFormData("date", e.currentTarget.value)}
          />
          <button type="submit">
            <svg
              class="bc_svg_icon bc_svg_add"
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
      </div>
      <div class="bc_footer">
        <span
          class={`bc_footer_remaining ${
            remainingBalanceByBudget(props.budget.id) > 0
              ? "positive"
              : "negative"
          }`}
        >
          Remaining: {remainingBalanceByBudget(props.budget.id).toFixed(2)}
        </span>
        <span class="bc_footer_spent">
          Spent: {totalSpentByBudget(props.budget.id).toFixed(2)}
        </span>
      </div>
    </div>
  );
};

export default BudgetCard;
