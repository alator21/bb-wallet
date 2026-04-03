/**
 * API Usage Stats API
 *
 * Functions for monitoring API usage statistics
 */

import type { Client } from '../client.ts';
import { request } from '../client.ts';
import type { Result } from '../types.ts';
import { QueryBuilder } from '../utils/query-builder.ts';

/**
 * Time granularity for usage statistics
 */
export type UsageGranularity = 'daily' | 'weekly' | 'monthly';

/**
 * Usage statistics entry for a specific time period
 */
export interface APIUsageStatsEntry {
  /**
   * Start of period, inclusive (ISO 8601 UTC timestamp, e.g., '2025-01-07T00:00:00Z')
   */
  from: string;
  /**
   * End of period, exclusive (ISO 8601 UTC timestamp).
   * This is the start of the next period, so the range is [from, to).
   * For daily granularity, 'to' is 'from' + 1 day.
   */
  to: string;
  /**
   * Total API requests in this period
   */
  total: number;
}

/**
 * API Usage Statistics response
 */
export interface APIUsageStats {
  /**
   * The requested period (e.g., '30days', '4weeks')
   */
  period: string;
  /**
   * Time granularity of the usage entries
   */
  granularity: UsageGranularity;
  /**
   * Start of the queried date range, inclusive (ISO 8601 UTC timestamp)
   */
  from: string;
  /**
   * End of the queried date range, exclusive (ISO 8601 UTC timestamp)
   */
  to: string;
  /**
   * Total API requests in the period
   */
  total: number;
  /**
   * Per-period request totals. Periods with zero usage are omitted.
   */
  usage: APIUsageStatsEntry[];
}

/**
 * Query parameters for API usage stats
 */
export interface APIUsageStatsQueryParams {
  /**
   * Time period for statistics.
   *
   * Formats:
   * - `Xdays` → daily granularity (max `366days`)
   * - `Xweeks` → weekly granularity, ISO weeks, Monday start (max `53weeks`)
   * - `Xmonths` → monthly granularity (max `13months`)
   *
   * Examples:
   * - '30days' - Last 30 days with daily buckets
   * - '4weeks' - Last 4 weeks with weekly buckets
   * - '6months' - Last 6 months with monthly buckets
   */
  period: string;
}

/**
 * Get REST API usage statistics for the authenticated client.
 *
 * All successful requests are counted (except the /api-usage/stats endpoint itself).
 * Use the period parameter to specify the time range and how it's grouped by time period.
 * Time ranges of each period use half-open intervals: from is inclusive, to is exclusive.
 *
 * @param client - The API client
 * @param params - Query parameters with the required period
 * @returns API usage statistics
 *
 * @example
 * ```typescript
 * // Get last 30 days with daily granularity
 * const result = await getAPIUsageStats(client, { period: '30days' });
 *
 * // Get last 4 weeks with weekly granularity
 * const result = await getAPIUsageStats(client, { period: '4weeks' });
 *
 * // Get last 6 months with monthly granularity
 * const result = await getAPIUsageStats(client, { period: '6months' });
 * ```
 */
export async function getAPIUsageStats(
  client: Client,
  params: APIUsageStatsQueryParams
): Promise<Result<APIUsageStats>> {
  const query = QueryBuilder.create()
    .add('period', params.period)
    .build();

  return request<APIUsageStats>(client, `/v1/api/api-usage/stats${query}`);
}
