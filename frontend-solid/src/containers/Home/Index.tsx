import { For, type Component } from "solid-js";

import budgetsStore from "@/stores/budgetsStore";
import BudgetCard from "./BudgetCard";

const Home: Component = () => {
  const { budgetList, refetch } = budgetsStore;

  return (
    <div>
      <button onClick={() => refetch()}>Refresh Me</button>

      <For each={budgetList()}>
        {(budget, _index) => <BudgetCard budget={budget} />}
      </For>
    </div>
  );
};

export default Home;
