import { Effect } from 'effect';
import type { BudgetBakersConfig } from './types.ts';
import { BudgetBakersError, createNetworkError, parseHttpError } from './errors.ts';

/**
 * Client instance - just holds configuration
 */
export interface Client {
  readonly baseUrl: string;
  readonly apiToken: string;
}

/**
 * Create a client instance
 */
export function createClient(config: BudgetBakersConfig): Client {
  return {
    baseUrl: config.baseUrl || 'https://rest.budgetbakers.com/wallet',
    apiToken: config.apiToken,
  };
}

/**
 * Internal: Make an Effect-based HTTP request
 */
export function request<T>(
  client: Client,
  endpoint: string,
  options?: RequestInit
): Effect.Effect<T, BudgetBakersError> {
  return Effect.tryPromise({
    try: async () => {
      const url = `${client.baseUrl}${endpoint}`;
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${client.apiToken}`,
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
 * Internal: Convert Effect to Promise with Result type
 */
export async function runEffect<T>(
  effect: Effect.Effect<T, BudgetBakersError>
): Promise<{ success: true; data: T } | { success: false; error: any }> {
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
