import { NuxtLink } from '../../../../../.nuxt/components';
<script setup lang="ts">
</script>

<template>
  <div>
    <h1>About YNAB</h1>
    <NuxtLink to="/ynab/budget" class="btn">Budget</NuxtLink>
    &nbsp;>&nbsp;
    <NuxtLink to="/ynab/category" class="btn">Categories</NuxtLink>
    &nbsp;:&nbsp;
    <NuxtLink to="/ynab/account" class="btn">Accounts</NuxtLink>
    &nbsp;>&nbsp;
    <!-- &nbsp;
    <NuxtLink to="/ynab/transaction" class="btn">Transactions</NuxtLink> -->
    <hr>
    <div class="prose max-w-full">
      <h2>Budgeting Tools</h2>
      <ul>
        <li>
          <NuxtLink to="/ynab/transactionXfer">Account to Account Transaction Transfer</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/ynab/clients">Clients</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/ynab/lpds">Distributions (Load Prioritized: LPDs)</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/ynab/marginDashboard">Margin Dashboard</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/ynab/paycheckPlanner">Paycheck Planner</NuxtLink>
        </li>
        <li>
          <NuxtLink to="/ynab/reconcileAssistant">Reconcile Assistant</NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>