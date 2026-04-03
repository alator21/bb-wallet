/**
 * API barrel exports
 *
 * Re-exports all API functions and types from resource modules
 */

// Shared embedded entity types
export type { LabelEmbed, CategoryEmbed } from '../types.ts';

// API Usage
export {
  getAPIUsageStats,
  type APIUsageStats,
  type APIUsageStatsEntry,
  type APIUsageStatsQueryParams,
  type UsageGranularity,
} from './api-usage.ts';

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
} from './budgets.ts';

// Categories
export {
  listCategories,
  type Category,
  type CategoriesResponse,
  type CategoriesQueryParams,
} from './categories.ts';

// Goals
export {
  listGoals,
  type Goal,
  type GoalsResponse,
  type GoalsQueryParams,
} from './goals.ts';

// Labels
export {
  listLabels,
  type Label,
  type LabelsResponse,
  type LabelsQueryParams,
} from './labels.ts';

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

// Record Rules
export {
  listRecordRules,
  type RecordRule,
  type RecordRulesResponse,
  type RecordRulesQueryParams,
} from './record-rules.ts';

// Standing Orders
export {
  listStandingOrders,
  type StandingOrder,
  type StandingOrderType,
  type StandingOrdersResponse,
  type StandingOrdersQueryParams,
} from './standing-orders.ts';
