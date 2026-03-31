import { Effect } from 'effect';
import type { BudgetBakersConfig, ResponseMetadata } from './types.ts';
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
 * Internal response with metadata
 */
interface ResponseWithMetadata<T> {
  data: T;
  metadata: ResponseMetadata;
}

/**
 * Parse response headers into metadata
 */
function parseResponseMetadata(headers: Headers): ResponseMetadata {
  const metadata: ResponseMetadata = {};

  const lastDataChangeAt = headers.get('X-Last-Data-Change-At');
  if (lastDataChangeAt) {
    metadata.lastDataChangeAt = lastDataChangeAt;
  }

  const lastDataChangeRev = headers.get('X-Last-Data-Change-Rev');
  if (lastDataChangeRev) {
    metadata.lastDataChangeRev = lastDataChangeRev;
  }

  const rateLimitLimit = headers.get('X-RateLimit-Limit');
  if (rateLimitLimit) {
    metadata.rateLimitLimit = parseInt(rateLimitLimit, 10);
  }

  const rateLimitRemaining = headers.get('X-RateLimit-Remaining');
  if (rateLimitRemaining) {
    metadata.rateLimitRemaining = parseInt(rateLimitRemaining, 10);
  }

  const syncInProgress = headers.get('X-Sync-In-Progress');
  if (syncInProgress) {
    metadata.syncInProgress = syncInProgress === 'true';
  }

  return metadata;
}

/**
 * Internal: Make an Effect-based HTTP request
 */
export function request<T>(
  client: Client,
  endpoint: string,
  options?: RequestInit
): Effect.Effect<ResponseWithMetadata<T>, BudgetBakersError> {
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
        let errorBody;
        try {
          errorBody = await response.json();
        } catch {
          errorBody = response.statusText;
        }
        const retryAfter = response.headers.get('Retry-After');
        throw parseHttpError(response.status, errorBody, retryAfter);
      }

      const data = await response.json() as T;
      const metadata = parseResponseMetadata(response.headers);

      return { data, metadata };
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
  effect: Effect.Effect<ResponseWithMetadata<T>, BudgetBakersError>
): Promise<{ success: true; data: T; metadata: ResponseMetadata } | { success: false; error: any }> {
  const exit = await Effect.runPromiseExit(effect);

  if (exit._tag === 'Success') {
    return {
      success: true,
      data: exit.value.data,
      metadata: exit.value.metadata,
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
