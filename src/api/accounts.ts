/**
 * Accounts API
 *
 * Functions for managing accounts
 */

import { Effect } from 'effect';
import type { Client } from '../client.ts';
import { request, runEffect } from '../client.ts';
import type { Result } from '../types.ts';
import type { TextFilter, RangeFilter } from '../filters.ts';
import { textFilterToString, rangeFilterToStrings } from '../filters.ts';

/**
 * Money value with currency
 */
export interface MoneyValue {
  currencyCode: string;
  value: number;
}

/**
 * Record statistics for an account
 */
export interface RecordStats {
  createdAt: {
    max: string;
    min: string;
  };
  recordCount: number;
  recordDate: {
    max: string;
    min: string;
  };
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
  accountType: AccountType;
  archived: boolean;
  bankAccountNumber: string;
  color: string;
  createdAt: string;
  excludeFromStats: boolean;
  id: string;
  initialBalance: MoneyValue;
  initialBaseBalance: MoneyValue;
  name: string;
  recordStats: RecordStats;
  updatedAt: string;
}

/**
 * Agent hint for AI-driven clients
 */
export interface AgentHint {
  action: {
    url: string;
  };
  data: unknown;
  severity: 'info' | 'warning' | 'error';
  text: string;
  type: string;
}

/**
 * Accounts list response
 */
export interface AccountsResponse {
  limit: number;
  nextOffset: number;
  offset: number;
  accounts: Account[];
  agentHints: AgentHint[];
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
  const queryParams = new URLSearchParams();

  if (params?.limit !== undefined) {
    queryParams.set('limit', params.limit.toString());
  }
  if (params?.offset !== undefined) {
    queryParams.set('offset', params.offset.toString());
  }
  if (params?.agentHints !== undefined) {
    queryParams.set('agentHints', params.agentHints.toString());
  }

  // ID - convert array to comma-separated string
  if (params?.id) {
    queryParams.set('id', params.id.join(','));
  }

  // Name - supports up to 2 filters for AND logic
  if (params?.name) {
    params.name.forEach((filter) => {
      queryParams.append('name', textFilterToString(filter));
    });
  }

  // Bank account number
  if (params?.bankAccountNumber) {
    params.bankAccountNumber.forEach((filter) => {
      queryParams.append('bankAccountNumber', textFilterToString(filter));
    });
  }

  // Account type
  if (params?.accountType) {
    queryParams.set('accountType', params.accountType);
  }

  // Currency code
  if (params?.currencyCode) {
    queryParams.set('currencyCode', params.currencyCode);
  }

  // Created at - range filter
  if (params?.createdAt) {
    const ranges = rangeFilterToStrings(params.createdAt);
    ranges.forEach((range) => {
      queryParams.append('createdAt', range);
    });
  }

  // Updated at - range filter
  if (params?.updatedAt) {
    const ranges = rangeFilterToStrings(params.updatedAt);
    ranges.forEach((range) => {
      queryParams.append('updatedAt', range);
    });
  }

  const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
  const effect = request<AccountsResponse>(
    client,
    `/v1/api/accounts${query}`
  );

  return runEffect(effect);
}
