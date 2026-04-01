import type { BudgetBakersConfig, ResponseMetadata, Result } from './types.ts';
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
 * Make an HTTP request and return a Result
 */
export async function request<T>(
  client: Client,
  endpoint: string,
  options?: RequestInit
): Promise<Result<T>> {
  try {
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

    return {
      success: true,
      data,
      metadata,
    };
  } catch (error) {
    if (error instanceof BudgetBakersError) {
      return {
        success: false,
        error: error.toApiError(),
      };
    }
    return {
      success: false,
      error: createNetworkError(
        error instanceof Error ? error.message : 'Network request failed',
        error
      ).toApiError(),
    };
  }
}
