import { defineStore } from 'pinia'
import * as ynab from 'ynab'
import { 
  Account, AccountResponse, BudgetDetail, BudgetDetailResponse, BudgetSummary, BudgetSummaryResponse, 
  BudgetMonth, BudgetMonthResponse, BudgetMonthsResponse, CategoryGroup, Category, CategoriesResponse,
  CategoryResponse, UpdateCategoryResponse, MonthCategory, MonthCategoryResponse, 
  Payee, PayeeResponse, PayeesResponse, UpdatePayeeResponse, 
  PayeeLocation, PayeeLocationsResponse, PayeeLocationResponse, PayeeLocationsByPayeeResponse,
  CreateScheduledTransactionResponse, ScheduledTransaction, ScheduledTransactionResponse,
  ScheduledTransactionsResponse, Transaction, CreateTransactionResponse, CreateTransactionsResponse,
  DeleteTransactionResponse, TransactionResponse, TransactionsResponse, ImportTransactionsResponse,
  UpdateTransactionResponse, UpdateTransactionsResponse, User, UserResponse
} from '@/data/ynab';

const usePrivateYNAB = defineStore('ynab-private', () => {
  // state & other attributes
  const accessToken = ref<string | null>(null)
  const authenticationActive = ref<boolean>(false)
  let timer: ReturnType<typeof setTimeout> | null = null

  // getters
  const authenticated = computed(() => {
    if (authenticationActive.value !== null && accessToken.value !== null) {
      return true
    }
  })
  const ready = computed(() => {
    return accessToken.value !== null
  })

  // actions
  const setAccessToken = (token: string) => {
    accessToken.value = token
  }

  const getAPI = () => {
    if (accessToken.value) {
      return new ynab.API(accessToken.value)
    } else {
      throw new Error('Access token is not set')
    }
  }
  
  const setExpireIn = (duration: number) => {
    const until = new Date()

    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      timerEvent();
    }, duration*1000);
    
    until.setSeconds(until.getSeconds() + Number(duration || 0));

    authenticationActive.value = true;
  }

  const timerEvent = () => {
    authenticationActive.value = false;
    if (timer) {
      clearTimeout(timer);
      accessToken.value = null;
    }
  }

  return {
    authenticated,
    getAPI,
    ready,
    setAccessToken,
    setExpireIn,
  }
})

export const useYnabStore = defineStore('ynab', () => {
  const _YNAB = usePrivateYNAB()
  let timer: ReturnType<typeof setTimeout> | null = null

  // state attributes
  const budgets = ref<any[]>([])
  const budget = ref<BudgetDetail | null>(null)
  const tokenType = ref<string | null>(null)
  
  const authicationActive = ref<boolean>(false)
  const expiresAt = ref<Date | null>(null)
  // getters
  const authenticationActive = computed(() => {
    return _YNAB.authenticated
  })

  // actions
  const clearBudgets = () => {
    budgets.value = []
  }

  const budgetName = computed(() => {
    return budget.value?.name || '(Not Selected)'
  })

  /* todo: add lastKnowledgeOfServer to the following functions */
  const getAccounts = async (budgetId: string): Promise<Account> => {
    const api = _YNAB.getAPI()
    const response: AccountResponse = await api.accounts.getAccounts(budgetId)
    return response.data.accounts
  }
  
  const getAccountById = async (budgetId: string, accountId: string): Promise<Account> => {
    const api = _YNAB.getAPI()
    const response: AccountResponse = await api.accounts.getAccountById(budgetId, accountId)
    return response.data.account
  }

  const createAccount = async (budgetId: string, accountData: Partial<Account>): Promise<Account> => {
    const api = _YNAB.getAPI()
    const response: CreateAccountResponse = await api.accounts.createAccount(budgetId, { account: accountData })
    return response.data.account
  }

  const getBudget = async (id: string): Promise<BudgetDetail> => {
    const api = _YNAB.getAPI()
    const response: BudgetDetailResponse = await api.budgets.getBudgetById(id)
    return response.data.budget
  }

  const getBudgets = async (): Promise<BudgetSummary[]> => {
    const api = _YNAB.getAPI()
    const response: BudgetSummaryResponse = await api.budgets.getBudgets()
    budgets.value = response.data.budgets
    return response.data.budgets
  }

  const getBudgetMonth = async (budgetId: string, month: string): Promise<BudgetMonth> => {
    const api = _YNAB.getAPI()
    const response: BudgetMonthResponse = await api.months.getBudgetMonth(budgetId, month)
    return response.data.month
  }

  const getBudgetMonths = async (budgetId: string): Promise<BudgetMonth[]> => {
    const api = _YNAB.getAPI()
    const response: BudgetMonthsResponse = await api.months.getBudgetMonths(budgetId)
    return response.data.months
  }

  const getCategories = async (budgetId: string): Promise<CategoryGroup[]> => {
    const api = _YNAB.getAPI()
    const response: ynab.CategoriesResponse = await api.categories.getCategories(budgetId)
    return response.data.category_groups
  }

  const getCategoryById = async (budgetId: string, categoryId: string): Promise<Category> => {
    const api = _YNAB.getAPI()
    const response: CategoryResponse = await api.categories.getCategoryById(budgetId, categoryId)
    return response.data.category
  }

  const getCategoriesByBudgetId = async (budgetId: string): Promise<CategoryGroup[]> => {
    const api = _YNAB.getAPI()
    const response: CategoriesResponse = await api.categories.getCategories(budgetId)
    return response.data.category_groups
  }

  const updateCategory = async (budgetId: string, categoryId: string, categoryData: Partial<Category>): Promise<Category> => {
    const api = _YNAB.getAPI()
    const response: UpdateCategoryResponse = await api.categories.updateCategory(budgetId, categoryId, categoryData)
    return response.data.category
  }

  const updateMonthCategory = async (budgetId: string, month: string, categoryId: string, categoryData: Partial<MonthCategory>): Promise<MonthCategory> => {
    const api = _YNAB.getAPI()
    const response: MonthCategoryResponse = await api.categories.updateMonthCategory(budgetId, month, categoryId, categoryData)
    return response.data.category
  }

  const getPayeeLocations = async (payeeId: string): Promise<PayeeLocation[]> => {
    const api = _YNAB.getAPI()
    const response: PayeeLocationsResponse = await api.payeeLocations.getPayeeLocations(payeeId)
    return response.data.payee_locations
  }

  const getPayeeLocationById = async (budgetId: string, payeeLocationId: string): Promise<PayeeLocation> => {
    const api = _YNAB.getAPI()
    const response: PayeeLocationResponse = await api.payeeLocations.getPayeeLocationById(budgetId, payeeLocationId)
    return response.data.payee_location
  }

  const getPayeeLocationsByPayee = async (budgetId: string, payeeId: string): Promise<PayeeLocation[]> => {
    const api = _YNAB.getAPI()
    const response: PayeeLocationsByPayeeResponse = await api.payeeLocations.getPayeeLocationsByPayee(budgetId, payeeId)
    return response.data.payee_locations
  }

  const getPayees = async (budgetId: string): Promise<Payee[]> => {
    const api = _YNAB.getAPI()
    const response: PayeesResponse = await api.payees.getPayees(budgetId)
    return response.data.payees
  }

  const getPayeeById = async (budgetId: string, payeeId: string): Promise<Payee> => {
    const api = _YNAB.getAPI()
    const response: PayeeResponse = await api.payees.getPayeeById(budgetId, payeeId)
    return response.data.payee
  }

  const updatePayee = async (budgetId: string, payeeId: string, payeeData: Partial<Payee>): Promise<Payee> => {
    const api = _YNAB.getAPI()
    const response: UpdatePayeeResponse = await api.payees.updatePayee(budgetId, payeeId, payeeData)
    return response.data.payee
  }

  const createScheduledTransaction = async (scheduledTransactionId: string, transactionData: Partial<ScheduledTransaction>): Promise<ScheduledTransaction> => {
    const api = _YNAB.getAPI()
    const response: CreateScheduledTransactionResponse = await api.scheduledTransactions.createScheduledTransaction(scheduledTransactionId, transactionData)
    return response.data.scheduled_transaction
  }

  const getScheduledTransactionById = async (budgetId: string, scheduledTransactionId: string): Promise<ScheduledTransaction> => {
    const api = _YNAB.getAPI()
    const response: ScheduledTransactionResponse = await api.scheduledTransactions.getScheduledTransactionById(budgetId, scheduledTransactionId)
    return response.data.scheduled_transaction
  }

  const getScheduledTransactions = async (budgetId: string): Promise<ScheduledTransaction[]> => {
    const api = _YNAB.getAPI()
    const response: ScheduledTransactionsResponse = await api.scheduledTransactions.getScheduledTransactions(budgetId)
    return response.data.scheduled_transactions
  }

  const createTransaction = async (budgetId: string, transactionData: Partial<Transaction>): Promise<Transaction> => {
    const api = _YNAB.getAPI()
    const response: CreateTransactionResponse = await api.transactions.createTransaction(budgetId, transactionData)
    return response.data.transaction
  }

  const createTransactions = async (budgetId: string, transactionsData: Partial<Transaction[]>): Promise<Transaction[]> => {
    const api = _YNAB.getAPI()
    const response: CreateTransactionsResponse = await api.transactions.createTransactions(budgetId, transactionsData)
    return response.data.transactions
  }

  const deleteTransaction = async (budgetId: string, transactionId: string): Promise<Transaction> => {
    const api = _YNAB.getAPI()
    const response: DeleteTransactionResponse = await api.transactions.deleteTransaction(budgetId, transactionId)
    return response.data
  }

  const getTransactionById = async (budgetId: string, transactionId: string): Promise<Transaction> => {
    const api = _YNAB.getAPI()
    const response: TransactionResponse = await api.transactions.getTransactionById(budgetId, transactionId)
    return response.data.transaction
  }

  const getTransactions = async (budgetId: string): Promise<Transaction[]> => {
    const api = _YNAB.getAPI()
    const response: TransactionsResponse = await api.transactions.getTransactions(budgetId)
    return response.data.transactions
  }

  const getTransactionsByAccountId = async (budgetId: string, accountId: string): Promise<Transaction[]> => {
    const api = _YNAB.getAPI()
    const response: TransactionsResponse = await api.transactions.getTransactionsByAccount(budgetId, accountId)
    return response.data.transactions
  }

  const getTransactionsByCategoryId = async (budgetId: string, categoryId: string): Promise<Transaction[]> => {
      const api = _YNAB.getAPI()
      const response: TransactionsResponse = await api.transactions.getTransactionsByCategory(budgetId, categoryId)
      return response.data.transactions
  }

  const getTransactionsByMonth = async (budgetId: string, month: string): Promise<Transaction[]> => {
    const api = _YNAB.getAPI()
    const response: TransactionsResponse = await api.transactions.getTransactionsByMonth(budgetId, month)
    return response.data.transactions
  }

  const getTransactionsByPayee = async (budgetId: string, payeeId: string): Promise<Transaction[]> => {
    const api = _YNAB.getAPI()
    const response: TransactionsResponse = await api.transactions.getTransactionsByPayee(budgetId, payeeId)
    return response.data.transactions
  }

  const getTransactionsByType = async (budgetId: string, type: string): Promise<Transaction[]> => {
    const api = _YNAB.getAPI()
    const response: TransactionsResponse = await api.transactions.getTransactionsByType(budgetId, type)
    return response.data.transactions
  }

  const importTransactions = async (budgetId: string): Promise<ImportTransactionsResponse> => {
    const api = _YNAB.getAPI()
    const response: ImportTransactionsResponse = await api.transactions.importTransactions(budgetId)
    return response.data.transactions
  }

  const updateTransaction = async (budgetId: string, transactionId: string, transactionData: Partial<Transaction>): Promise<Transaction> => {
    const api = _YNAB.getAPI()
    const response: UpdateTransactionResponse = await api.transactions.updateTransaction(budgetId, transactionId, transactionData)
    return response.data.transaction
  }

  const updateTransactions = async (budgetId: string, transactionsData: Partial<Transaction[]>): Promise<Transaction[]> => {
    const api = _YNAB.getAPI()
    const response: UpdateTransactionsResponse = await api.transactions.updateTransactions(budgetId, transactionsData)
    return response.data.transactions
  }

  const getUser = async (): Promise<User> => {
    const api = _YNAB.getAPI()
    const response: UserResponse = await api.user.getUser()
    return response.data.user
  }

  const setBudget = (budgetChoice: ynab.BudgetDetail) => {
    console.warn('Setting budget:', budgetChoice)
    budget.value = budgetChoice
  }

  const setAccessToken = async (token: string) => {
    console.log('Setting access token:', token)
    _YNAB.setAccessToken(token)
  }

  const setExpiresAt = (duration: number) => {
    _YNAB.setExpireIn(duration)
  }
  
  return {
    budget,
    budgetName,
    budgets,
    expiresAt,
    tokenType,
    createAccount,
    getAccounts,
    getAccountById,
    clearBudgets,
    getBudget,
    getBudgets,
    getBudgetMonth,
    getBudgetMonths,
    getCategories,
    getCategoryById,
    getCategoriesByBudgetId,
    updateCategory,
    updateMonthCategory,
    getPayeeLocations,
    getPayeeLocationById,
    getPayeeLocationsByPayee,
    getPayees,
    getPayeeById,
    updatePayee,
    createScheduledTransaction,
    getScheduledTransactionById,
    getScheduledTransactions,
    createTransaction,
    createTransactions,
    deleteTransaction,
    getTransactionById,
    getTransactions,
    getTransactionsByAccountId,
    getTransactionsByCategoryId,
    getTransactionsByMonth,
    getTransactionsByPayee,
    getTransactionsByType,
    importTransactions,
    updateTransaction,
    updateTransactions,
    getUser,
    setAccessToken,
    setBudget,
    setExpiresAt,
  }
  
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useYnabStore, import.meta.hot));
}
