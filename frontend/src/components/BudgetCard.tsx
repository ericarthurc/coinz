import { Component, For } from "solid-js";
import ExpenseForm from "./ExpenseForm";
import ExpenseCard from "./ExpenseCard";

const BudgetCard: Component<{
  entry: any;
  addExpense: (
    event: any,
    bud_id: any,
    cat_id: any,
    data: { store: string; amount: number }
  ) => void;
  deleteExpense: (event: any, exp_id: any) => void;
}> = (props) => {
  function calculateSpent(entry: any): number {
    let spent = 0;

    for (const element of entry.expenses) {
      spent += parseInt(element.amount);
    }

    return spent;
  }

  function calculateRemaining(entry: any): number {
    let total = entry.categories.amount;

    for (const element of entry.expenses) {
      total -= parseInt(element.amount);
    }

    return total;
  }

  return (
    <div id="budget_card" class="budget_card">
      <div class="budget_card_header">
        <span class="budget_card_category">
          {props.entry.categories.name.charAt(0).toUpperCase() +
            props.entry.categories.name.slice(1)}
        </span>
        <span class="budget_card_total">
          Budget Total: ${props.entry.categories.amount}
        </span>
      </div>
      <For each={props.entry.expenses}>
        {(expense, i) => (
          <ExpenseCard expense={expense} deleteExpense={props.deleteExpense} />
        )}
      </For>
      <ExpenseForm entry={props.entry} addExpense={props.addExpense} />
      <span>Total Spent: ${calculateSpent(props.entry).toString()} | </span>
      <span>Remaining: ${calculateRemaining(props.entry).toString()}</span>
    </div>
  );
};

export default BudgetCard;
