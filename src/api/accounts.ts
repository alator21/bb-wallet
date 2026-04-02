/**
 * Accounts API
 *
 * Functions for managing accounts
 */

import type { Client } from '../client.ts';
import { request } from '../client.ts';
import type { Result, AgentHint, BalanceWithCurrency, StatDateRange } from '../types.ts';
import type { TextFilter, RangeFilter } from '../utils/filters.ts';
import { QueryBuilder } from '../utils/query-builder.ts';

/**
 * Account statistics (record counts and date ranges)
 */
export interface AccountStats {
  recordCount: number;
  recordDate: StatDateRange;
  createdAt: StatDateRange;
}

/**
 * Account type enum
 */
export type AccountType =
  | 'General'
  | 'Cash'
  | 'CurrentAccount'
  | 'CreditCard'
  | 'SavingAccount'
  | 'Bonus'
  | 'Insurance'
  | 'Investment'
  | 'Loan'
  | 'Mortgage'
  | 'Overdraft';

/**
 * Account entity
 */
export interface Account {
  id: string;
  archived: boolean;
  color: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  accountType: AccountType;
  excludeFromStats: boolean;
  // Optional fields (only present when set)
  bankAccountNumber?: string;
  initialBalance?: BalanceWithCurrency;
  initialBaseBalance?: BalanceWithCurrency;
  recordStats?: AccountStats | null;
}

/**
 * Accounts list response
 */
export interface AccountsResponse {
  limit: number;
  nextOffset?: number;
  offset: number;
  accounts: Account[];
  agentHints?: AgentHint[] | null;
}

/**
 * Query parameters for listing accounts
 */
export interface AccountsQueryParams {
  /**
   * Maximum number of items to return (1-200, default: 30)
   */
  limit?: number;

  /**
   * Number of items to skip (default: 0). Used for pagination.
   */
  offset?: number;

  /**
   * Enable AI agent hints in response. When true, includes structured hints
   * to help AI agents understand the response and take follow-up actions.
   */
  agentHints?: boolean;

  /**
   * Filter by ID. Supports multiple IDs (max 30).
   */
  id?: string[];

  /**
   * Filter by name. Can be specified up to 2 times for AND logic.
   */
  name?: TextFilter[];

  /**
   * Filter by bank account number.
   */
  bankAccountNumber?: TextFilter[];

  /**
   * Filter accounts by account type. Case-insensitive.
   */
  accountType?: AccountType;

  /**
   * Filter by currency code (ISO 4217). Exact match, case-insensitive.
   */
  currencyCode?: string;

  /**
   * Filter by creation timestamp.
   */
  createdAt?: RangeFilter;

  /**
   * Filter by last sync timestamp.
   */
  updatedAt?: RangeFilter;
}

/**
 * List all accounts with pagination and filtering
 */
export async function listAccounts(
  client: Client,
  params?: AccountsQueryParams
): Promise<Result<AccountsResponse>> {
  const query = QueryBuilder.create()
    .add('limit', params?.limit)
    .add('offset', params?.offset)
    .add('agentHints', params?.agentHints)
    .addArray('id', params?.id)
    .addTextFilters('name', params?.name)
    .addTextFilters('bankAccountNumber', params?.bankAccountNumber)
    .add('accountType', params?.accountType)
    .add('currencyCode', params?.currencyCode)
    .addRangeFilter('createdAt', params?.createdAt)
    .addRangeFilter('updatedAt', params?.updatedAt)
    .build();

  return request<AccountsResponse>(client, `/v1/api/accounts${query}`);
}
