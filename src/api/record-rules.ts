/**
 * Record Rules API
 *
 * Functions for managing automatic categorization rules for records
 */

import type { Client } from '../client.ts';
import { request } from '../client.ts';
import type { Result, AgentHint, CategoryEmbed, LabelEmbed } from '../types.ts';
import type { TextFilter, RangeFilter } from '../utils/filters.ts';
import { QueryBuilder } from '../utils/query-builder.ts';

/**
 * Record Rule entity
 */
export interface RecordRule {
  /**
   * Unique identifier
   */
  id: string;

  /**
   * Rule name
   */
  name: string;

  /**
   * Keywords that trigger this rule
   */
  keywords: string[];

  /**
   * Category to apply when rule matches
   */
  category: CategoryEmbed;

  /**
   * Labels to apply when rule matches
   */
  labels: LabelEmbed[];

  /**
   * Source account ID (for transfer rules)
   */
  fromAccountId?: string;

  /**
   * Destination account ID (for transfer rules)
   */
  toAccountId?: string;

  /**
   * Creation timestamp
   */
  createdAt: string;

  /**
   * Last update timestamp
   */
  updatedAt: string;
}

/**
 * Record Rules list response
 */
export interface RecordRulesResponse {
  limit: number;
  nextOffset?: number;
  offset: number;
  recordRules: RecordRule[];
  agentHints?: AgentHint[] | null;
}

/**
 * Query parameters for listing record rules
 */
export interface RecordRulesQueryParams {
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
   * Filter by creation timestamp.
   */
  createdAt?: RangeFilter;

  /**
   * Filter by last sync timestamp.
   */
  updatedAt?: RangeFilter;
}

/**
 * List all automatic categorization rules for records with pagination and filtering
 *
 * @param client - The API client
 * @param params - Optional query parameters for filtering and pagination
 * @returns Paginated list of record rules
 *
 * @example
 * ```typescript
 * // Get all record rules
 * const result = await listRecordRules(client);
 *
 * // Filter by name
 * const result = await listRecordRules(client, {
 *   name: [{ containsInsensitive: 'grocery' }],
 *   limit: 50
 * });
 *
 * // Get recently created rules
 * const result = await listRecordRules(client, {
 *   createdAt: { gte: '2024-01-01T00:00:00Z' }
 * });
 * ```
 */
export async function listRecordRules(
  client: Client,
  params?: RecordRulesQueryParams
): Promise<Result<RecordRulesResponse>> {
  const query = QueryBuilder.create()
    .add('limit', params?.limit)
    .add('offset', params?.offset)
    .add('agentHints', params?.agentHints)
    .addArray('id', params?.id)
    .addTextFilters('name', params?.name)
    .addRangeFilter('createdAt', params?.createdAt)
    .addRangeFilter('updatedAt', params?.updatedAt)
    .build();

  return request<RecordRulesResponse>(client, `/v1/api/record-rules${query}`);
}
