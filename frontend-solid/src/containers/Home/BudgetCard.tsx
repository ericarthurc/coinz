import { Component, For } from "solid-js";

import { Budget } from "@/types";
import ExpenseItem from "./ExpenseItem";

interface IProps {
  budget: Budget;
}

const BudgetCard: Component<IProps> = (props) => {
  return (
    <div style={"padding-bottom: 10px"}>
      <span>{props.budget.id}</span>
      <span>{props.budget.category_name}</span>
      <span>{props.budget.category_id}</span>
      <span>{props.budget.budget_amount}</span>
      <For each={props.budget.expenses}>
        {(expense, _index) => <ExpenseItem expense={expense} />}
      </For>
    </div>
  );
};

export default BudgetCard;
