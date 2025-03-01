import { For, type Component } from "solid-js";

import budgetsStore from "@/stores/budgetsStore";
import BudgetCard from "./BudgetCard";

import "./home.scss";

const Home: Component = () => {
  const { budgetList, refetch } = budgetsStore;

  return (
    <div class="home_layout">
      <button onClick={() => refetch()}>Refresh Me</button>
      <div class="budgets_container">
        <For each={budgetList()}>
          {(budget, _index) => <BudgetCard budget={budget} />}
        </For>
      </div>
    </div>
  );
};

export default Home;
