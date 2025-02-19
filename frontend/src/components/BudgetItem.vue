<script lang="ts" setup>
import { useBudgetsStore } from "@/stores/budgets";
import ExpenseForm from "./ExpenseForm.vue";
import ExpenseItem from "./ExpenseItem.vue";
import type { IDtoBudget } from "@/types";

const budgetsStore = useBudgetsStore();

const props = defineProps<{ budget: IDtoBudget }>();
</script>

<template>
  <div class="category-container">
    <div class="category-header">
      <span class="category-title">{{ props.budget.category_name }}</span>
      <span class="category-total"
        >Total: {{ props.budget.budget_amount }}</span
      >
    </div>
    <div class="expense-container">
      <ExpenseItem
        v-for="expense in props.budget.expenses"
        :expense="expense"
        :key="expense.id"
      />
    </div>
    <ExpenseForm :budgetId="props.budget.id" />
    <div class="category-footer">
      <span class="category-footer-remaining"
        >Remaining:
        {{ budgetsStore.calculateRemaining(props.budget.id).toFixed(2) }}</span
      >
      <span class="category-footer-spent"
        >Total Spent:
        {{ budgetsStore.calculateSpent(props.budget.id).toFixed(2) }}</span
      >
    </div>
  </div>
</template>
