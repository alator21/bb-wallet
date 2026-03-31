/**
 * API barrel exports
 *
 * Re-exports all API functions and types from resource modules
 */

// Accounts
export {
  listAccounts,
  type Account,
  type AccountType,
  type AccountsResponse,
  type MoneyValue,
  type RecordStats,
  type AgentHint,
} from './accounts.ts';

// Records
export {
  listRecords,
  getRecord,
  createRecord,
  updateRecord,
  deleteRecord,
  type Record,
  type RecordFilters,
} from './records.ts';

// Categories
export {
  listCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  type Category,
} from './categories.ts';
