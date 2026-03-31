/**
 * Filter types and utilities
 *
 * Shared filter types and helper functions for API query parameters
 */

/**
 * Text filter for string fields
 *
 * Supports exact match, case-sensitive and case-insensitive substring matching.
 */
export type TextFilter =
  | { eq: string }
  | { contains: string }
  | { containsInsensitive: string };

/**
 * Range filter for numeric and datetime fields
 *
 * Supports equality and comparison operators.
 * Can specify multiple conditions (e.g., gte and lt for a range).
 */
export interface RangeFilter {
  eq?: string;
  gt?: string;
  gte?: string;
  lt?: string;
  lte?: string;
}

/**
 * Convert TextFilter to API string format
 *
 * @param filter - The text filter object
 * @returns API-formatted filter string (e.g., "eq.value", "contains-i.value")
 */
export function textFilterToString(filter: TextFilter): string {
  if ('eq' in filter) return `eq.${filter.eq}`;
  if ('contains' in filter) return `contains.${filter.contains}`;
  if ('containsInsensitive' in filter) return `contains-i.${filter.containsInsensitive}`;
  return '';
}

/**
 * Convert RangeFilter to API string array format
 *
 * @param filter - The range filter object
 * @returns Array of API-formatted filter strings (e.g., ["gte.100", "lte.500"])
 */
export function rangeFilterToStrings(filter: RangeFilter): string[] {
  const result: string[] = [];
  if (filter.eq !== undefined) result.push(`eq.${filter.eq}`);
  if (filter.gt !== undefined) result.push(`gt.${filter.gt}`);
  if (filter.gte !== undefined) result.push(`gte.${filter.gte}`);
  if (filter.lt !== undefined) result.push(`lt.${filter.lt}`);
  if (filter.lte !== undefined) result.push(`lte.${filter.lte}`);
  return result;
}
