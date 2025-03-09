import { For, Show, type Component } from "solid-js";

import budgetsStore from "@/stores/budgetsStore";
import BudgetCard from "./BudgetCard";

import "./home.scss";

const Home: Component = () => {
  const { budgetList, totalSpentOverall } = budgetsStore;

  return (
    <div class="home_layout">
      <p style={"color:white;"}>
        TOTAL SPENT:{" "}
        <Show when={budgetList().length > 0}>{totalSpentOverall()}</Show>
      </p>
      <div class="budgets_container">
        <For each={budgetList()}>
          {(budget, _index) => <BudgetCard budget={budget} />}
        </For>
      </div>
    </div>
  );
};

export default Home;
