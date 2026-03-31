/**
 * Budget Bakers Wallet API Wrapper
 *
 * A TypeScript wrapper for the Budget Bakers Wallet REST API
 * Built with Effect.ts internally but exposes a Promise-based API
 */

import { Effect } from 'effect';
import { HttpClient } from './client.ts';
import type { BudgetBakersConfig, Result, PaginationParams, PaginatedResponse } from './types.ts';

export class BudgetBakersWallet extends HttpClient {
  constructor(config: BudgetBakersConfig) {
    super(config);
  }

  /**
   * Example method showing the pattern for API calls
   * Replace this with actual API methods based on the Budget Bakers API
   */
  async getUser(): Promise<Result<{ id: string; email: string }>> {
    const effect = this.request<{ id: string; email: string }>('/user');
    return this.runEffect(effect);
  }

  /**
   * Example paginated method
   */
  async listAccounts(
    params?: PaginationParams
  ): Promise<Result<PaginatedResponse<unknown>>> {
    const queryParams = new URLSearchParams();
    if (params?.limit) queryParams.set('limit', params.limit.toString());
    if (params?.offset) queryParams.set('offset', params.offset.toString());

    const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
    const effect = this.request<{ data: unknown[]; nextOffset?: number }>(
      `/accounts${query}`
    );

    return this.runEffect(
      Effect.map(effect, (response) => ({
        data: response.data,
        nextOffset: response.nextOffset,
        hasMore: response.nextOffset !== undefined,
      }))
    );
  }
}

// Export types for consumers
export type {
  BudgetBakersConfig,
  Result,
  Success,
  Failure,
  ApiError,
  ApiErrorType,
  PaginationParams,
  PaginatedResponse,
} from './types.ts';

export default BudgetBakersWallet;
