// ynab.ts

export interface Account {
  id: string;
  name: string;
  type: string;
  on_budget: boolean;
  closed: boolean;
  note?: string | null | undefined;
  balance: number;
  cleared_balance: number;
  uncleared_balance: number;
  transfer_payee_id?: string | null;
  direct_import_linked?: boolean | undefined;
  direct_import_in_error?: boolean | undefined;
  deleted: boolean;
}

interface CreateAccountResponse {
  data: {
    account: Account;
  };
}

interface AccountResponse {
  data: {
    account: Account;
  };
}

interface BudgetDetailResponse {
  data: {
    budget: BudgetDetail;
  };
}

interface BudgetDetail {
  id: string;
  name: string;
  last_modified_on: string;
  first_month: string;
  last_month: string;
  accounts: Account[];
  categories: CategoryGroup[];
  // Add other relevant fields based on the actual API response
}

interface BudgetSummaryResponse {
  data: {
    budgets: BudgetSummary[];
  };
}

export interface BudgetSummary {
  id: string;
  name: string;
  last_modified_on: string;
  first_month: string;
  last_month: string;
  date_format: DateFormat;
  currency_format: CurrencyFormat;
}

interface BudgetMonthResponse {
  data: {
    month: BudgetMonth;
  };
}

interface BudgetMonthsResponse {
  data: {
    months: BudgetMonth[];
  };
}

interface BudgetMonth {
  month: string;
  income: number;
  budgeted: number;
  activity: number;
  to_be_budgeted: number;
  age_of_money: number;
  // Add other relevant fields based on the actual API response
}

interface CategoriesResponse {
  data: {
    category_groups: CategoryGroup[];
  };
}

interface CategoryResponse {
  data: {
    category: CategoryReturn;
  };
}

interface UpdateCategoryResponse {
  data: {
    category: Category;
  };
}

export interface Category {
  id: string;
  category_group_id: string;
  category_group_name: string;
  name: string;
  hidden: boolean;
  original_category_group_id: string | null;
  note: string | null;
  budgeted: number;
  activity: number;
  balance: number;
  goal_type: string | null;
  goal_creation_month: string | null;
  goal_target: number | null;
  goal_target_month: string | null;
  goal_percentage_complete: number | null;
  deleted: boolean;
}

interface CategoryReturn { 
  id: string;
  category_group_id: string;
  category_group_name: string;
  name: string;
  hidden: boolean;
  original_category_group_id: string | null;
  note: string | null;
  budgeted: number;
  activity: number;
  balance: number;
  goal_type: string | null;
  goal_needs_whole_amount: boolean | null;
  goal_day: number | null;
  goal_cadence: string | null;
  goal_cadence_frequency: string | null;
  goal_creation_month: string | null;
  goal_target: number;
  goal_target_month: string | null;
  goal_percentage_complete: number | null;
  goal_months_to_budget: number | null;
  goal_under_funded: number | null;
  goal_overall_funded: number | null;
  goal_overall_left: number | null;
  deleted: boolean;
}

interface CategoryGroup {
  id: string;
  name: string;
  categories: Category[];
  // Add other relevant fields based on the actual API response
}

interface UpdateMonthCategoryResponse {
  data: {
    category: MonthCategory;
  };
}

interface MonthCategory {
  id: string;
  name: string;
  budgeted: number;
  activity: number;
  balance: number;
  // Add other relevant fields based on the actual API response
}

export interface CurrencyFormat {
  iso_code: string;
  example_format: string;
  decimal_digits: number;
  decimal_separator: string;
  symbol_first: boolean;
  group_separator: string;
  currency_symbol: string;
  display_symbol: boolean;
}

export interface DateFormat {
  format: string;
}

export interface MonthDetail {
  month: string;
  note: string | null;
  income: number;
  budgeted: number;
  activity: number;
  to_be_budgeted: number;
  age_of_money: number | null;
  deleted: boolean;
  categories: Category[];
}

interface PayeeLocationsResponse {
  data: {
    payee_locations: PayeeLocation[];
  };
}

interface PayeeLocationResponse {
  data: {
    payee_location: PayeeLocation;
  };
}

interface PayeeLocationsByPayeeResponse {
  data: {
    payee_locations: PayeeLocation[];
  };
}

interface PayeeLocation {
  id: string;
  payee_id: string;
  latitude: number;
  longitude: number;
  deleted: boolean;
  // Add other relevant fields based on the actual API response
}

interface PayeesResponse {
  data: {
    payees: Payee[];
  };
}

export interface Payee {
  id: string;
  name: string;
  transfer_account_id: string | null;
  deleted: boolean;
}

interface CreateScheduledTransactionResponse {
  data: {
    scheduled_transaction: ScheduledTransaction;
  };
}

interface ScheduledTransactionResponse {
  data: {
    scheduled_transaction: ScheduledTransaction;
  };
}

interface ScheduledTransactionsResponse {
  data: {
    scheduled_transactions: ScheduledTransaction[];
  };
}

interface ScheduledTransaction {
  id: string;
  date_first: string;
  date_next: string;
  frequency: string;
  amount: number;
  memo: string | null;
  flag_color: string | null;
  account_id: string;
  payee_id: string | null;
  category_id: string | null;
  transfer_account_id: string | null;
  deleted: boolean;
  // Add other relevant fields based on the actual API response
}

interface CreateTransactionResponse {
  data: {
    transaction: Transaction;
  };
}

interface DeleteTransactionResponse {
  data: {
    transaction: Transaction;
  };
}

interface TransactionResponse {
  data: {
    transaction: Transaction;
  };
}

interface TransactionsResponse {
  data: {
    transactions: Transaction[];
  };
}

interface ImportTransactionsResponse {
  data: {
    transaction_ids: string[];
    duplicate_import_ids: string[];
    transactions: Transaction[];
  };
}

interface UpdateTransactionResponse {
  data: {
    transaction: Transaction;
  };
}

interface UpdateTransactionsResponse {
  data: {
    transactions: Transaction[];
  };
}

export interface Transaction {
  id?: string;
  date: string;
  amount: number;
  memo: string | null;
  cleared: string;
  approved: boolean;
  flag_color: string | null;
  account_id: string;
  payee_id?: string | null;
  payee_name?: string | null;
  category_id?: string | null;
  category_name?: string | null;
  transfer_account_id?: string | null;
  transfer_transaction_id?: string | null;
  matched_transaction_id?: string | null;
  import_id?: string | null;
  deleted?: boolean;
}

interface UserResponse {
  data: {
    user: User;
  };
}

interface User {
  id: string;
  // Add other relevant fields based on the actual API response
}

// API Response Types
/*
export interface GetBudgetsResponse {
  data: {
    budgets: BudgetSummary[];
  };
}

export interface GetAccountsResponse {
  data: {
    accounts: Account[];
  };
}

export interface GetCategoriesResponse {
  data: {
    categories: Category[];
  };
}

export interface GetTransactionsResponse {
  data: {
    transactions: Transaction[];
  };
}

export interface GetMonthDetailResponse {
  data: {
    month: MonthDetail;
  };
}

export interface GetPayeesResponse {
  data: {
    payees: Payee[];
  };
}
*/

// Error Response Types

export interface ErrorResponse {
  error: {
    id: string;
    name: string;
    message: string;
    status: number;
  };
}

// API Client Interface
/*
export interface YNABAPI {
  budgets: {
    getBudgets: () => Promise<GetBudgetsResponse>;
    getBudgetById: (budgetId: string) => Promise<GetBudgetsResponse>;
  };
  accounts: {
    getAccounts: () => Promise<GetAccountsResponse>;
  };
  categories: {
    getCategories: () => Promise<GetCategoriesResponse>;
  };
  transactions: {
    getTransactions: (budgetId: string) => Promise<GetTransactionsResponse>;
  };
  months: {
    getMonthDetail: (budgetId: string, month: string) => Promise<GetMonthDetailResponse>;
  };
  payees: {
    getPayees: () => Promise<GetPayeesResponse>;
  };
}
  */

// API Error Handling
/*
export function handleError(response: ErrorResponse): void {
  console.error(`Error ${response.error.id}: ${response.error.message}`);
}
  */

// API Client Implementation
/*
export class YNABClient implements YNABAPI {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  private async request(endpoint: string): Promise<any> {
    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });

    if (!response.ok) {
      const errorResponse: ErrorResponse = await response.json();
      handleError(errorResponse);
      throw new Error(errorResponse.error.message);
    }

    return response.json();
  }

  async budgets() {
    return this.request('/budgets');
  }

  async accounts() {
    return this.request('/accounts');
  }

  async categories() {
    return this.request('/categories');
  }

  async transactions(budgetId: string) {
    return this.request(`/budgets/${budgetId}/transactions`);
  }

  async months(budgetId: string, month: string) {
    return this.request(`/budgets/${budgetId}/months/${month}`);
  }

  async payees() {
    return this.request('/payees');
  }
}
  */

// Usage Example
/*
const ynabClient = new YNABClient('your_access_token_here');

ynabClient.budgets().then(response => {
  console.log(response);
}).catch(error => {
  console.error(error);
});
*/

// Note: Replace 'your_access_token_here' with a valid access token.
