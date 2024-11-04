<script setup lang="ts">
import * as ynab from 'ynab';
import { useYnabStore } from '../../store/ynabStore';

const ynabStore = useYnabStore();

const budgets = ref([]);

onMounted(async () => {
  // await ynabStore.getBudgets();
  // budgets.value = ynabStore.budgets;
});

const getBudgets = async () => {
  await ynabStore.getBudgets();
  budgets.value = ynabStore.budgets;
};

// const budgets = ref(getBudgets());
console.log(budgets.value);
</script>

<template>
  <div>
    <h1>Budgets {{ budgets.length }}</h1>
    <hr>
    <button @click="getBudgets" class="btn">Refresh Budgets</button>
    <button @click="ynabStore.clearBudgets" class="btn">Clear Budgets</button>
    <div v-for="budget in ynabStore.budgets" :key="budget.id" class="prose">
      <h2 class="text-secondary">{{ budget.name }}</h2>
      {{ budget }}
      <hr>
    </div>
  </div>
</template>