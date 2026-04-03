/**
 * Goals API
 *
 * Functions for managing financial goals
 */

import type { Client } from '../client.ts';
import { request } from '../client.ts';
import type { Result, AgentHint } from '../types.ts';
import type { TextFilter, RangeFilter } from '../utils/filters.ts';
import { QueryBuilder } from '../utils/query-builder.ts';

/**
 * Goal entity
 */
export interface Goal {
  /**
   * Unique identifier
   */
  id: string;

  /**
   * Goal name
   */
  name: string;

  /**
   * Goal color (hex code)
   */
  color: string;

  /**
   * Icon name
   */
  iconName: string;

  /**
   * Initial saved amount
   */
  initialAmount: string;

  /**
   * Target amount to reach
   */
  targetAmount: string;

  /**
   * Desired completion date
   */
  desiredDate: string;

  /**
   * Goal state (e.g., 'active', 'completed', 'paused')
   */
  state: string;

  /**
   * Timestamp when the state was last updated
   */
  stateUpdatedAt: string;

  /**
   * Creation timestamp
   */
  createdAt: string;

  /**
   * Last update timestamp
   */
  updatedAt: string;

  /**
   * Optional note/description
   */
  note?: string;
}

/**
 * Goals list response
 */
export interface GoalsResponse {
  limit: number;
  nextOffset?: number;
  offset: number;
  goals: Goal[];
  agentHints?: AgentHint[] | null;
}

/**
 * Query parameters for listing goals
 */
export interface GoalsQueryParams {
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
   * Filter by note content.
   */
  note?: TextFilter[];

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
 * List all financial goals with pagination and filtering
 *
 * @param client - The API client
 * @param params - Optional query parameters for filtering and pagination
 * @returns Paginated list of goals
 *
 * @example
 * ```typescript
 * // Get all goals
 * const result = await listGoals(client);
 *
 * // Filter by name
 * const result = await listGoals(client, {
 *   name: [{ containsInsensitive: 'vacation' }],
 *   limit: 50
 * });
 *
 * // Filter by note content
 * const result = await listGoals(client, {
 *   note: [{ containsInsensitive: 'emergency fund' }]
 * });
 * ```
 */
export async function listGoals(
  client: Client,
  params?: GoalsQueryParams
): Promise<Result<GoalsResponse>> {
  const query = QueryBuilder.create()
    .add('limit', params?.limit)
    .add('offset', params?.offset)
    .add('agentHints', params?.agentHints)
    .addArray('id', params?.id)
    .addTextFilters('name', params?.name)
    .addTextFilters('note', params?.note)
    .addRangeFilter('createdAt', params?.createdAt)
    .addRangeFilter('updatedAt', params?.updatedAt)
    .build();

  return request<GoalsResponse>(client, `/v1/api/goals${query}`);
}
