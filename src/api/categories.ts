/**
 * Categories API
 *
 * Functions for managing categories
 */

import type { Client } from '../client.ts';
import { request } from '../client.ts';
import type { Result } from '../types.ts';
import type { TextFilter, RangeFilter } from '../utils/filters.ts';
import { QueryBuilder } from '../utils/query-builder.ts';

/**
 * Category entity
 */
export interface Category {
  archived: boolean;
  cardinality: string;
  color: string;
  createdAt: string;
  customCategory: boolean;
  customColor: boolean;
  customName: boolean;
  enabled: boolean;
  envelopeId: number;
  iconName: string;
  id: string;
  name: string;
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
 * Categories list response
 */
export interface CategoriesResponse {
  limit: number;
  nextOffset: number;
  offset: number;
  categories: Category[];
  agentHints: AgentHint[];
}

/**
 * Query parameters for listing categories
 */
export interface CategoriesQueryParams {
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
 * List all categories with pagination and filtering
 */
export async function listCategories(
  client: Client,
  params?: CategoriesQueryParams
): Promise<Result<CategoriesResponse>> {
  const query = QueryBuilder.create()
    .add('limit', params?.limit)
    .add('offset', params?.offset)
    .add('agentHints', params?.agentHints)
    .addArray('id', params?.id)
    .addTextFilters('name', params?.name)
    .addRangeFilter('createdAt', params?.createdAt)
    .addRangeFilter('updatedAt', params?.updatedAt)
    .build();

  return request<CategoriesResponse>(client, `/v1/api/categories${query}`);
}
