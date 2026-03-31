/**
 * Budget Bakers Wallet API Wrapper
 *
 * A TypeScript wrapper for the Budget Bakers Wallet REST API
 * Built with Effect.ts internally but exposes a functional Promise-based API
 */

// Export client factory
export { createClient } from './client.ts';
export type { Client } from './client.ts';

// Export all API functions and types
export * from './api/index.ts';

// Export base types
export type {
  BudgetBakersConfig,
  Result,
  Success,
  Failure,
  ApiError,
  ApiErrorType,
  PaginationParams,
  PaginatedResponse,
} from './types.ts';

// Export filter types
export type { TextFilter, RangeFilter } from './filters.ts';
