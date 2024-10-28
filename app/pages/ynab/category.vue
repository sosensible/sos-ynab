<script setup lang="ts">
import * as ynab from 'ynab';
import { useYnabStore } from '../../store/ynab';

const ynabStore = useYnabStore();
const withGoals = ref(false);
const showTables = ref<boolean[]>([]); // Track visibility of tables for each category group

const groups = ref<ynab.CategoryGroup[]>([]);

const toggleGoals = () => {
  withGoals.value = !withGoals.value;
};

const toggleTable = (index: number) => {
  showTables.value[index] = !showTables.value[index];
};

const getCategories = async () => {
  const budgetId = ynabStore.budget.id;
  if (budgetId) {
    groups.value = await ynabStore.getCategories(budgetId);
  } else {
    console.error('Budget ID is null');
  }
};

onMounted(async () => {
  // await ynabStore.getCategories();
  // categories.value = ynabStore.categories;
});
</script>

<template>
  <div>
    <h1>{{ ynabStore.budgetName }} Categories {{ groups.length }}</h1> ( <input type="checkbox" name="goal" id=""
      @click="toggleGoals"> Show Goals
    ? )
    <hr>
    <button @click="getCategories" class="btn">Refresh Categories</button>
    <div v-for="(group, index) in groups" :key="group.id" class="prose">
      <h2 class="text-secondary">{{ group.name }}</h2>
      <input type="checkbox" :id="'table-toggle-' + index" @click="toggleTable(index)"> Show Table
      <table v-if="showTables[index]" id="category2-table" class="min-w-full divide-y divide-gray-500">
        <thead>
          <tr>
            <!-- <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">ID</th> -->
            <!-- <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Category Group ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Category Group Name</th> -->
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
            <!-- <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Hidden</th> -->
            <!-- <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Original Category Group ID</th> -->
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Budgeted</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Activity</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Balance</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Note</th>
            <template v-if="withGoals">
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Goal Type</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Goal Needs
                Whole
                Amount</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Goal Day</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Goal Cadence
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Goal Cadence
                Frequency</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Goal Creation
                Month</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Goal Target
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Goal Target
                Month
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Goal Percentage
                Complete</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Goal Months to
                Budget</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Goal Under
                Funded
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Goal Overall
                Funded</th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Goal Overall
                Left
              </th>
            </template>
            <!-- <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Deleted</th> -->
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-500">
          <template v-for="category in group.categories">
            <tr :key="category.id" class="even:bg-gray-700 odd:bg-gray-800"
              v-if="category.hidden === false || category.deleted === true">
              <!-- <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{{ category.id }}</td> -->
              <!-- <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{{ category.category_group_id }}</td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{{ category.category_group_name }}</td> -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{{ category.name }}</td>
              <!-- <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{{ category.hidden }}</td> -->
              <!-- <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{{ category.original_category_group_id }}</td> -->
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{{ category.budgeted }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{{ category.activity }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{{ category.balance }}</td>
              <td class="px-6 py-4 text-sm text-gray-200">{{ category.note }}</td>
              <template v-if="withGoals">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{{ category.goal_type }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{{ category.goal_needs_whole_amount }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{{ category.goal_day }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{{ category.goal_cadence }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{{ category.goal_cadence_frequency }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{{ category.goal_creation_month }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{{ category.goal_target }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{{ category.goal_target_month }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{{ category.goal_percentage_complete }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{{ category.goal_months_to_budget }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{{ category.goal_under_funded }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{{ category.goal_overall_funded }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{{ category.goal_overall_left }}</td>
              </template>
              <!-- <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{{ category.deleted }}</td> -->
            </tr>
          </template>
        </tbody>
      </table>
      <hr>
    </div>
  </div>
</template>