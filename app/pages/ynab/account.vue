<script setup lang="ts">
import * as ynab from '../../data/ynab';
import { useYnabStore } from '../../stores/ynabStore';

// general state & declarations
const ynabStore = useYnabStore();
const budgets = ref<ynab.BudgetDetail[]>([]);
const missingCategoryList = ref<string[]>([]);
// source state
const sourceBudgetId = ref<string | null>(null);
const sourceAccounts = ref<ynab.Account[]>([]);
const sourceAccount = ref<string | null>(null);
const sourceCategories = ref<ynab.CategoryGroup[]>([]);
const sourceCategoriesFlattened = ref<ynab.Category[]>([]);
const sourceTransactions = ref<ynab.Transaction[]>([]); // Track visibility of tables for each category group
const sourceFiltered = ref<ynab.Transaction[]>([]);
const sourceTransactionsCategories = ref<Set<string>>(new Set());
// target state
const targetBudgetId = ref<string | null>(null);
const targetAccounts = ref<ynab.Account[]>([]);// Track visibility of tables for each category group
const targetAccount = ref<string | null>(null);
const targetCategories = ref<Set<string>>(new Set());
const targetCategoriesRaw = ref<ynab.Category[]>([]);
const targetCategoriesFlattened = ref<ynab.Category[]>([]);
const selectedField = ref<string>('flag_color'); // Default field for filtering
const filterValue = ref<string>(''); // Default value for filtering

const getBudgets = async () => {
  budgets.value = await ynabStore.getBudgets();
};

getBudgets();

const getSourceAccounts = async () => {
  sourceAccounts.value = await ynabStore.getAccounts(sourceBudgetId.value);
  sourceCategories.value = await ynabStore.getCategories(sourceBudgetId.value);
  sourceCategoriesFlattened.value = flattenCategories(sourceCategories.value);
};

const getSourceTransactions = async () => {
  if (sourceBudgetId.value && sourceAccount.value) {
    sourceTransactions.value = await ynabStore.getTransactionsByAccountId(sourceBudgetId.value, sourceAccount.value.id);
    sourceFiltered.value = sourceTransactions.value; // Initialize filtered with all transactions
  } else {
    console.error('Source Budget ID or Source Account is null');
  }
};

const getTargetAccounts = async () => {
  targetAccounts.value = await ynabStore.getAccounts(targetBudgetId.value);
};

const getTargetCategories = async () => {
  if (targetBudgetId.value && targetAccount.value) {
    const _targetCategories = await ynabStore.getCategories(targetBudgetId.value) as Set<ynab.CategoryGroup>;
    targetCategoriesRaw.value = _targetCategories;

    // Assuming _targetCategories is a Set of category groups
    const flattenedCategories = flattenCategories(_targetCategories);
    targetCategoriesFlattened.value = flattenedCategories;

    console.log('Flattened Categories:', flattenedCategories);

    targetCategories.value = new Set(flattenedCategories.map(category => category.name));
    console.log('Target Categories:', targetCategories.value);
  } else {
    console.error('Target Budget ID or Target Account is null');
  }
};

const filterTransactions = () => {
  let filter: boolean | string = filterValue.value;
  const prependPayees = ['Manual Balance Adjustment', 'Reconciliation Balance Adjustment'];
  const removePayees = ['Starting Balance'];
  if (selectedField.value === 'approved') {
    filter = filter === 'true' ? true : false; // If no filter, show all transactions
  }
  console.log('Filtering transactions by', selectedField.value, 'with value', filter);
  const _transactions = sourceTransactions.value
    .filter(transactionItem => transactionItem[selectedField.value] === filter)
    .map(transaction => {
      if (prependPayees.includes(transaction.payee_name)) {
        return {
          ...transaction,
          payee_name: `_${transaction.payee_name}`
        };
      }
      return transaction;
    })
    .filter(transaction => !removePayees.includes(transaction.payee_name));

  sourceFiltered.value = _transactions;
  sourceTransactionsCategories.value = new Set(getUniqueSourceTransactionCategories());
};

const transferTransactions = async () => {
  console.log('Transferring transactions...');
  if (targetAccount.value) {
    if (sourceFiltered.value.length > 0) {
      let _transactions = sourceFiltered.value
        .map(transaction => {
          const { id, payee_id, ...rest } = transaction;
          return {
            ...rest,
            account_id: targetAccount.value.id,
            payee_name: transaction.payee_name.includes('Transfer') ? transaction.payee_name.replace('Transfer', 'XFer') : transaction.payee_name,
            category_name: transaction.category_name, // Include category_name
            category_id: getCategoryIdByName(transaction.category_name),
          }
        })
      console.log('Transactions to transfer:', _transactions);
      const transferResponse = await ynabStore.createTransactions(targetBudgetId.value, { transactions: _transactions });
      console.log('Transfer Response:', transferResponse);
    } else {
      console.error('no transactions selected for transfer');
    }
  } else {
    console.error('Target Account is null');
  }
};

const getCategoryIdByName = (category_name) => {
  if (targetCategoriesFlattened.value.length === 0) return '';
  const category = targetCategoriesFlattened.value.find(category => category.name === category_name);
  return category ? category.id : '';
};

const getUniqueSourceTransactionCategories = (): string[] => {
  const uniqueCategories = new Set<string>();
  sourceFiltered.value.forEach(transaction => {
    if (transaction.category_id) {
      uniqueCategories.add(transaction.category_name);
    }
  });

  return Array.from(uniqueCategories);
};

const flattenCategories = (categories: ynab.CategoryGroup[]) => {
  return Array.from(categories)
    .flatMap((categoryGroup: ynab.CategoryGroup) => categoryGroup.categories);
};


const getMissingCategories = () => {
  missingCategoryList.value = Array.from(sourceTransactionsCategories.value).filter(category => !targetCategories.value.has(category));
};

const updateTransferReady = computed(() => {
  return Array.from(targetCategories.value).every(category => !sourceTransactionsCategories.value.has(category));
});

</script>

<template>
  <div class="bg-green-950">

    <div> <!-- Source Section -->
      <!-- Source Budget Section -->
      <div class="prose">
        <h1>Source > to > Target Transfers</h1>
        <h2 class="text-secondary mb-3">Source Budget Transactions</h2>

        <select v-model="sourceBudgetId" class="select select-sm w-full max-w-xs bg-slate-950 mb-3"
          @change="getSourceAccounts">
          <option :value="sBudget.id" v-for="sBudget in budgets">{{ sBudget.name }}</option>
        </select>
        Select Source Budget

      </div>

      <!-- Source Account Section -->
      <div>
        <select v-model="sourceAccount" class="select select-sm w-full max-w-xs bg-slate-950 mb-3"
          @change="getSourceTransactions">
          <option v-for="account in sourceAccounts" :key="account.id" :value="account">
            {{ account.name }}
          </option>
        </select>
        Select Source Account
      </div>

      <!-- Source Filter Section -->
      <div>
        <select v-model="selectedField" class="select select-sm w-full max-w-xs bg-slate-950 mb-3">
          <option value="approved">Approved</option>
          <option value="cleared">Cleared</option>
          <option value="flag_color">Flag Color</option>
        </select>
        <br>
        <input type="text" v-model="filterValue" placeholder="Filter Value"
          class="input input-sm max-w-xs bg-slate-950" />
        :
        <button @click="filterTransactions()" class="btn btn-sm max-w-xs content-primary">Filter {{ selectedField
          }}</button>
        <div tabindex="1" class="xcollapse">
          <div class="prose max-w-full">
            <h2 class="text-secondary xcollapse-title appearance-none">Show selected transactions for (
              selectedAccount.name
              ... {{
                sourceFiltered.length }}) with {{ sourceTransactionsCategories.length }} unique categories</h2>
          </div>
          <table id="category2-table" class="min-w-full divide-y divide-gray-500 xcollapse-content w-full">
            <thead>
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Date</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Memo</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Cleared</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Approved</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Payee</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Category</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Flag</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-500">
              <tr v-for="transaction in sourceFiltered" :key="transaction.id" class="even:bg-gray-700 odd:bg-gray-800">
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{{ transaction.date }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{{ transaction.amount }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{{ transaction.memo }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{{ transaction.cleared }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{{ transaction.approved }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{{ transaction.payee_name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{{ transaction.category_name }}</td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-200">{{ transaction.flag_color }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="prose w-full max-w-none"><!-- Target Section -->
      <!-- Target Budget Section -->
      <div>
        <h3>Select Transfer Target</h3>

        <select v-model="targetBudgetId" class="select select-sm w-full max-w-xs bg-slate-950 mb-3"
          @change="getTargetAccounts">
          <option :value="tBudget.id" v-for="tBudget in budgets">{{ tBudget.name }}</option>
        </select>
      </div>

      <!-- Target Account Section -->
      <div>
        <select v-model="targetAccount" class="select select-sm w-full max-w-xs bg-slate-950 mb-3"
          @change="getTargetCategories">
          <option v-for="account in targetAccounts" :key="account.id" :value="account">
            {{ account.name }}
          </option>
        </select>
        Select Target Account
      </div>
      {{ sourceTransactionsCategories }}
      <!-- Target Transfer Section -->
      <div>
        <h3>Do Transfers</h3>
        <ol>
          <li>
            Check to see all the needed categories are there.
            <ul>
              <li>
                ✅ getUniqueSourceTransactionCategories (happens when selecting source account, pulled from source
                transactions)
              </li>
              <li>
                ✅ pull categories from the target budget ( happens when selecting target account )
              </li>
              <li>
                compare the two lists and display any missing categories (check when both source and target are
                selected, or on demand with a button)
              </li>
              <li>
                repeat check until all categories are present then enable transfer button
              </li>
            </ul>
          </li>
          <li>
            <button class="btn" @click="transferTransactions" :xdisabled="!transferReady">Transfer Items</button>
          </li>
          <li>
            Verify Transfer In Target Budget Account (not being built yet)
          </li>
          <li>
            ❌ <button class="btn">Remove from Source Budget Account</button>
          </li>
        </ol>
        <h4>Missing Categories in Target Budget</h4>
        <button class="btn" @click="getMissingCategories">Show Missing Categories</button>
        <ul>
          <li v-for="category in missingCategoryList" :key="category.id">

            {{ category }}
          </li>
        </ul>
        <h5>Missing Categories</h5>
        {{ missingCategoryList }}

        <hr>
        <div class="grid grid-cols-3 gap-4 w-full">

          <div class="w-1/3">

            <h3>Source Categories {{ sourceCategories.length }}</h3>
            <ul>
              <li v-for="categoryGroup in sourceCategories" :key="categoryGroup.id">
                {{ categoryGroup.name }}
                <ul>
                  <li v-for="category in categoryGroup.categories" :key="category.id">
                    {{ category.name }}
                  </li>
                </ul>
              </li>
            </ul>

          </div>

          <div class="w-1/3">

            <h3>Source Categories Flattened {{ sourceCategoriesFlattened.length }}</h3>
            <ul>
              <li v-for="category in sourceCategoriesFlattened" :key="category.id">
                {{ category.name }}
              </li>
            </ul>

          </div>

          <div class="w-1/3">

            <h3>Transfer Categories</h3>
            <ul>
              <li v-for="category in sourceTransactionsCategories" :key="category">
                {{ category }} : {{ getCategoryIdByName(category) }}@
              </li>
            </ul>

          </div>

        </div>


        <hr>


        <div class="grid grid-cols-3 gap-4 w-full">

          <div class="w-1/3">

            <h3>Target Transactions Categories {{ targetCategoriesRaw.length }}</h3>
            <ul>
              <li v-for="categoryGroup in targetCategoriesRaw" :key="categoryGroup.id">
                {{ categoryGroup.name }}
                <ul>
                  <li v-for="category in categoryGroup.categories" :key="category.id">{{ category.name }}</li>
                </ul>
              </li>
            </ul>

          </div>

          <div class="w-1/3">

            <h3>Target Categories Flattened {{ targetCategories.size }}</h3>
            <ul>
              <li v-for="category in targetCategories" :key="category.id">
                {{ category }}
              </li>
            </ul>

          </div>

          <div class="w-1/3">

            <h3>Transfer Categories</h3>
            <ul>
              <li v-for="category in sourceTransactionsCategories">
                {{ category }}
              </li>
            </ul>

          </div>

        </div>

        <hr>

        <h5>Target Categories</h5>
        {{ targetCategories }}
        <hr>
        <h5>Source Transaction Categories</h5>
        {{ sourceTransactionsCategories }}
        <hr>
      </div>
    </div>
  </div>
</template>