/**
 * API barrel exports
 *
 * Re-exports all API functions and types from resource modules
 */

// Accounts
export {
  listAccounts,
  getAccount,
  createAccount,
  updateAccount,
  deleteAccount,
  type Account,
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
