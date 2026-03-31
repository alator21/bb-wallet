import { Effect } from 'effect';
import type { BudgetBakersConfig, Result } from './types.ts';
import { BudgetBakersError, createNetworkError, parseHttpError } from './errors.ts';

/**
 * Internal HTTP client using Effect
 */
export class HttpClient {
  private readonly baseUrl: string;
  private readonly apiToken: string;

  constructor(config: BudgetBakersConfig) {
    this.baseUrl = config.baseUrl || 'https://rest.budgetbakers.com/wallet';
    this.apiToken = config.apiToken;
  }

  /**
   * Make an Effect-based HTTP request
   */
  protected request<T>(
    endpoint: string,
    options?: RequestInit
  ): Effect.Effect<T, BudgetBakersError> {
    return Effect.tryPromise({
      try: async () => {
        const url = `${this.baseUrl}${endpoint}`;
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiToken}`,
          ...options?.headers,
        };

        const response = await fetch(url, {
          ...options,
          headers,
        });

        if (!response.ok) {
          throw parseHttpError(response.status, response.statusText);
        }

        return response.json() as Promise<T>;
      },
      catch: (error) => {
        if (error instanceof BudgetBakersError) {
          return error;
        }
        return createNetworkError(
          error instanceof Error ? error.message : 'Network request failed',
          error
        );
      },
    });
  }

  /**
   * Convert Effect to Promise with Result type
   */
  protected async runEffect<T>(
    effect: Effect.Effect<T, BudgetBakersError>
  ): Promise<Result<T>> {
    const exit = await Effect.runPromiseExit(effect);

    if (exit._tag === 'Success') {
      return {
        success: true,
        data: exit.value,
      };
    }

    return {
      success: false,
      error: exit.cause._tag === 'Fail'
        ? exit.cause.error.toApiError()
        : {
            type: 'UnknownError',
            message: 'An unknown error occurred',
          },
    };
  }
}
