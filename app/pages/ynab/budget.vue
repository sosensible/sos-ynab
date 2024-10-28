<script setup lang="ts">
import * as ynab from 'ynab';
import { useYnabStore } from '../../store/ynab';

const ynabStore = useYnabStore();
const budgetId = ynabStore.budgetId;

const budgets = ref([]);

onMounted(async () => {
  // await ynabStore.getBudgets();
  // budgets.value = ynabStore.budgets;
});

const getBudgets = async () => {
  await ynabStore.getBudgets(budgetId);
  budgets.value = ynabStore.budgets;
};

const setBudget = (budget) => {
  console.log(budget)
  ynabStore.setBudget(budget);
};

// const budgets = ref(getBudgets());
console.log(budgets.value);
</script>

<template>
  <div class="prose">
    <h1>Budget: {{ ynabStore.budgetName }}</h1>
    <hr>
    <button @click="getBudgets" class="btn">Refresh Budgets</button>
    <button @click="ynabStore.clearBudgets" class="btn">Clear Budgets</button>
    <div v-for="budget in ynabStore.budgets" :key="budget.id" class="prose">
      <h2 class="text-secondary">{{ budget.name }} <button @click="setBudget(budget)" class="btn">Set As
          Active</button></h2>
      <hr>
    </div>
  </div>
</template>