/**
 * Labels API
 *
 * Functions for managing labels/hashtags
 */

import type { Client } from '../client.ts';
import { request } from '../client.ts';
import type { Result, AgentHint } from '../types.ts';
import type { TextFilter, RangeFilter } from '../utils/filters.ts';
import { QueryBuilder } from '../utils/query-builder.ts';

/**
 * Label entity (full version with timestamps)
 */
export interface Label {
  /**
   * Unique identifier
   */
  id: string;

  /**
   * Label name
   */
  name: string;

  /**
   * Hex color code
   */
  color: string;

  /**
   * Whether the label is archived
   */
  archived: boolean;

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
 * Labels list response
 */
export interface LabelsResponse {
  limit: number;
  nextOffset?: number;
  offset: number;
  labels: Label[];
  agentHints?: AgentHint[] | null;
}

/**
 * Query parameters for listing labels
 */
export interface LabelsQueryParams {
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
 * List all labels/hashtags with pagination and filtering
 *
 * @param client - The API client
 * @param params - Optional query parameters for filtering and pagination
 * @returns Paginated list of labels
 *
 * @example
 * ```typescript
 * // Get all labels
 * const result = await listLabels(client);
 *
 * // Filter by name
 * const result = await listLabels(client, {
 *   name: [{ containsInsensitive: 'important' }],
 *   limit: 50
 * });
 *
 * // Get non-archived labels
 * const result = await listLabels(client, {
 *   limit: 100
 * });
 * ```
 */
export async function listLabels(
  client: Client,
  params?: LabelsQueryParams
): Promise<Result<LabelsResponse>> {
  const query = QueryBuilder.create()
    .add('limit', params?.limit)
    .add('offset', params?.offset)
    .add('agentHints', params?.agentHints)
    .addArray('id', params?.id)
    .addTextFilters('name', params?.name)
    .addRangeFilter('createdAt', params?.createdAt)
    .addRangeFilter('updatedAt', params?.updatedAt)
    .build();

  return request<LabelsResponse>(client, `/v1/api/labels${query}`);
}
