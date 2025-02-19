<script setup lang="ts">
import { ref } from "vue";
import { useBudgetsStore } from "@/stores/budgets";

const budgetsStore = useBudgetsStore();

const props = defineProps({
  budgetId: { type: Number, required: true },
});

const spent = ref();
const store = ref("");

async function handleSubmit() {
  try {
    await budgetsStore.addExpenseToBudget(
      props.budgetId,
      spent.value,
      store.value
    );
    spent.value = undefined;
    store.value = "";
  } catch (error) {
    console.log("le poopy");
  }
}
</script>

<template>
  <div class="expense-adder-form-container">
    <form class="expense-adder-form" @submit.prevent="handleSubmit">
      <label for="store">Store:</label>
      <input v-model="store" type="text" required />
      <label for="amout">Spent:</label>
      <input v-model="spent" type="number" step="0.01" required />
      <button class="button-svg" type="submit">
        <svg
          class="expense-add-svg"
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
</template>
