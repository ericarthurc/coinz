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
  <div class="home-container">
    <BudgetItem
      v-for="(budget, _) in budgetsStore.budgetsArray"
      :key="budget.id"
      :budget="budget"
    />
  </div>
</template>
