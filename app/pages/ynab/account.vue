<script setup lang="ts">
import * as ynab from 'ynab';
import { useYnabStore } from '../../store/ynab';
import { Account } from '../../data/ynab';

const ynabStore = useYnabStore();
const withGoals = ref(false);
const showTables = ref<boolean[]>([]); // Track visibility of tables for each category group
const selectedAccount = ref<ynab.Account | null>(null);

const accounts = ref<ynab.Account[]>([]);
const transactions = ref<ynab.Transaction[]>([]);

const getTransactions = async () => {
  const budgetId = ynabStore.budget.id;
  if (budgetId && selectedAccount.value) {
    transactions.value = await ynabStore.getTransactionsByAccountId(budgetId, selectedAccount.value.id);
  } else {
    console.error('Budget ID or selected account is null');
  }
};

const getAccounts = async () => {
  const budgetId = ynabStore.budget.id;
  if (budgetId) {
    accounts.value = await ynabStore.getAccounts(budgetId);
  } else {
    console.error('Budget ID is null');
  }
};
</script>

<template>
  <div>
    <h1>{{ ynabStore.budgetName }} Accounts</h1>
    <h2 v-if="selectedAccount">{{ selectedAccount.name }}</h2>
    <hr>
    <button @click="getAccounts" class="btn">Refresh Accounts</button>
    <select v-model="selectedAccount">
      <option v-for="account in accounts" :key="account.id" :value="account">
        {{ account.name }}
      </option>
    </select>
    :
    <button @click="getTransactions" class="btn">Get Transactions</button>

    {{ transactions.length }} transactions found.

    <div class="prose">
      <h2 class="text-secondary">{{ transactions.account_name }}</h2>
      <table id="category2-table" class="min-w-full divide-y divide-gray-500">
        <thead>
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Memo</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Cleared</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Approved</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Payee</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Category</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-500">
          <tr v-for="transaction in transactions" :key="transaction.id" class="even:bg-gray-700 odd:bg-gray-800">
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{{ transaction.date }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{{ transaction.amount }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{{ transaction.memo }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{{ transaction.cleared }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{{ transaction.approved }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{{ transaction.payee_name }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{{ transaction.category_name }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>