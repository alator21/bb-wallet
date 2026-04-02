/**
 * Budgets API
 *
 * Functions for managing budgets
 */

import type { Client } from '../client.ts';
import { request } from '../client.ts';
import type { Result, AgentHint } from '../types.ts';
import type { TextFilter, RangeFilter } from '../utils/filters.ts';
import { QueryBuilder } from '../utils/query-builder.ts';

/**
 * Label entity (embedded in other resources)
 */
export interface LabelEmbed {
  id: string;
  name: string;
  color: string;
  archived: boolean;
}

/**
 * Full Label entity with timestamps
 */
export interface Label {
  id: string;
  name: string;
  color: string;
  archived: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Budget entity
 */
export interface Budget {
  id: string;
  amount: string;
  currencyCode: string;
  labels: LabelEmbed[];
  name: string;
  createdAt: string;
  updatedAt: string;
  endDate: string;
  startDate: string;
  // Optional fields (only present when set)
  accountIds?: string[];
  categoryIds?: string[];
  type?: string;
}

/**
 * Budgets list response
 */
export interface BudgetsResponse {
  limit: number;
  nextOffset?: number;
  offset: number;
  budgets: Budget[];
  agentHints?: AgentHint[] | null;
}

/**
 * Query parameters for listing budgets
 */
export interface BudgetsQueryParams {
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
 * List all budgets with pagination and filtering
 */
export async function listBudgets(
  client: Client,
  params?: BudgetsQueryParams
): Promise<Result<BudgetsResponse>> {
  const query = QueryBuilder.create()
    .add('limit', params?.limit)
    .add('offset', params?.offset)
    .add('agentHints', params?.agentHints)
    .addArray('id', params?.id)
    .addTextFilters('name', params?.name)
    .add('currencyCode', params?.currencyCode)
    .addRangeFilter('createdAt', params?.createdAt)
    .addRangeFilter('updatedAt', params?.updatedAt)
    .build();

  return request<BudgetsResponse>(client, `/v1/api/budgets${query}`);
}
