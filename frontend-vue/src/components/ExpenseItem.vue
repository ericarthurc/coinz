<script lang="ts" setup>
import { useBudgetsStore } from "@/stores/budgets";
import type { IDtoExpense } from "@/types";
import type { PropType } from "vue";

const budgetsStore = useBudgetsStore();

const props = defineProps({
  budget_id: { type: Number, required: true },
  expense: { type: Object as PropType<IDtoExpense>, required: true },
});
</script>

<template>
  <div class="expense-item">
    <div class="expense-item-header">
      <span class="expense-store">{{ props.expense.store }}</span>
      <button
        class="button-svg"
        @click="budgetsStore.deleteExpense(props.budget_id, props.expense.id)"
      >
        <svg
          class="expense-remove-svg"
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
            d="M8 12h8m6 0c0 5.523-4.477 10-10 10S2 17.523 2 12S6.477 2 12 2s10 4.477 10 10"
          />
        </svg>
      </button>
    </div>
    <div class="expense-item-info">
      <span class="expense-timestamp">{{
        new Date(props.expense.expense_timestamp!).toLocaleDateString("en-US", {
          timeZone: "America/Los_Angeles",
          month: "short",
          day: "2-digit",
        })
      }}</span>
      <span class="expense-spent">${{ props.expense.expense_spent }}</span>
    </div>
  </div>
</template>
