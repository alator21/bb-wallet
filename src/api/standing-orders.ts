/**
 * Standing Orders API
 *
 * Functions for managing recurring payments
 */

import type { Client } from '../client.ts';
import { request } from '../client.ts';
import type { Result, AgentHint, LabelEmbed } from '../types.ts';
import type { TextFilter, RangeFilter } from '../utils/filters.ts';
import { QueryBuilder } from '../utils/query-builder.ts';

/**
 * Standing order type
 */
export type StandingOrderType = 'income' | 'expense';

/**
 * Standing Order entity (recurring payment)
 */
export interface StandingOrder {
  /**
   * Unique identifier
   */
  id: string;

  /**
   * Standing order name
   */
  name: string;

  /**
   * Transaction type: income or expense
   */
  type: StandingOrderType;

  /**
   * Account ID
   */
  accountId: string;

  /**
   * Amount in decimal format (e.g., 1234.56)
   */
  amount: string;

  /**
   * Currency code (ISO 4217)
   */
  currencyCode: string;

  /**
   * Category ID
   */
  categoryId: string;

  /**
   * Recurrence rule in RRULE format (RFC 5545)
   */
  recurrenceRule: string;

  /**
   * Date from which to start generating transactions
   */
  generateFromDate: string;

  /**
   * Whether this requires manual payment confirmation
   */
  manualPayment: boolean;

  /**
   * Labels attached to this standing order
   */
  labels?: LabelEmbed[];

  /**
   * Creation timestamp
   */
  createdAt: string;

  /**
   * Last update timestamp
   */
  updatedAt: string;

  /**
   * Optional note
   */
  note?: string;

  /**
   * Payee name (for expense records)
   */
  payee?: string;

  /**
   * Payer name (for income records)
   */
  payer?: string;

  /**
   * Payment type/method
   */
  paymentType?: string;
}

/**
 * Standing Orders list response
 */
export interface StandingOrdersResponse {
  limit: number;
  nextOffset?: number;
  offset: number;
  standingOrders: StandingOrder[];
  agentHints?: AgentHint[] | null;
}

/**
 * Query parameters for listing standing orders
 */
export interface StandingOrdersQueryParams {
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
 * List all recurring payments (standing orders) with pagination and filtering
 *
 * @param client - The API client
 * @param params - Optional query parameters for filtering and pagination
 * @returns Paginated list of standing orders
 *
 * @example
 * ```typescript
 * // Get all standing orders
 * const result = await listStandingOrders(client);
 *
 * // Filter by name
 * const result = await listStandingOrders(client, {
 *   name: [{ containsInsensitive: 'rent' }],
 *   limit: 50
 * });
 *
 * // Filter by currency
 * const result = await listStandingOrders(client, {
 *   currencyCode: 'USD'
 * });
 * ```
 */
export async function listStandingOrders(
  client: Client,
  params?: StandingOrdersQueryParams
): Promise<Result<StandingOrdersResponse>> {
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

  return request<StandingOrdersResponse>(client, `/v1/api/standing-orders${query}`);
}
