/**
 * Query Builder
 *
 * Effect-based fluent interface for building URL query parameters
 */

import { Effect } from 'effect';
import type { TextFilter, RangeFilter } from './filters.ts';
import { textFilterToString, rangeFilterToStrings } from './filters.ts';

/**
 * Fluent query parameter builder
 */
export class QueryBuilder {
  private params: URLSearchParams;

  private constructor() {
    this.params = new URLSearchParams();
  }

  /**
   * Create a new QueryBuilder instance
   */
  static create(): QueryBuilder {
    return new QueryBuilder();
  }

  /**
   * Add a scalar parameter (string, number, boolean)
   */
  add(key: string, value: string | number | boolean | undefined): this {
    if (value !== undefined) {
      this.params.set(key, value.toString());
    }
    return this;
  }

  /**
   * Add an array parameter as comma-separated values
   */
  addArray(key: string, values: string[] | undefined): this {
    if (values && values.length > 0) {
      this.params.set(key, values.join(','));
    }
    return this;
  }

  /**
   * Add text filter parameters (can append multiple for AND logic)
   */
  addTextFilters(key: string, filters: TextFilter[] | undefined): this {
    if (filters && filters.length > 0) {
      filters.forEach((filter) => {
        this.params.append(key, textFilterToString(filter));
      });
    }
    return this;
  }

  /**
   * Add range filter parameters
   */
  addRangeFilter(key: string, filter: RangeFilter | undefined): this {
    if (filter) {
      const ranges = rangeFilterToStrings(filter);
      ranges.forEach((range) => {
        this.params.append(key, range);
      });
    }
    return this;
  }

  /**
   * Build the query string
   */
  build(): string {
    const query = this.params.toString();
    return query ? `?${query}` : '';
  }

  /**
   * Build as an Effect (for future validation/transformation)
   */
  buildEffect(): Effect.Effect<string, never> {
    return Effect.succeed(this.build());
  }
}
