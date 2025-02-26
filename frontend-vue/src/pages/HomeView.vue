<script lang="ts" setup>
import { onMounted } from "vue";
import { useBudgetsStore } from "@/stores/budgets";
import BudgetItem from "@/components/BudgetItem.vue";

const budgetsStore = useBudgetsStore();

onMounted(async () => {
  await budgetsStore.getBudgets();
});
</script>

<template>
  <h3 v-if="budgetsStore.budgetsArray[0]" class="budget-month">
    {{ budgetsStore.budgetsArray[0].month }}'s Budget
  </h3>
  <div class="home-container">
    <BudgetItem
      v-for="(budget, _) in budgetsStore.budgetsArray"
      :key="budget.id"
      :budget="budget"
    />
  </div>
</template>
