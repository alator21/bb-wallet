/**
 * API barrel exports
 *
 * Re-exports all API functions and types from resource modules
 */

// Shared embedded entity types
export type { LabelEmbed, CategoryEmbed } from '../types.ts';

// Accounts
export {
  listAccounts,
  type Account,
  type AccountType,
  type AccountsResponse,
  type AccountsQueryParams,
  type AccountStats,
} from './accounts.ts';

// Budgets
export {
  listBudgets,
  type Budget,
  type BudgetsResponse,
  type BudgetsQueryParams,
  type Label,
} from './budgets.ts';

// Categories
export {
  listCategories,
  type Category,
  type CategoriesResponse,
  type CategoriesQueryParams,
} from './categories.ts';

// Records
export {
  listRecords,
  getRecordsByIds,
  type Record,
  type RecordsResponse,
  type RecordsByIdResponse,
  type RecordsQueryParams,
  type RecordType,
  type RecordState,
  type PaymentType,
  type RecordSortBy,
  type RecordPhoto,
  type RecordPlace,
} from './records.ts';
