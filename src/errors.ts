import type { ApiError, ApiErrorType } from './types.ts';

/**
 * Budget Bakers API error class
 */
export class BudgetBakersError extends Error {
  constructor(
    public readonly type: ApiErrorType,
    message: string,
    public readonly statusCode?: number,
    public readonly details?: unknown,
    public readonly retryAfter?: number
  ) {
    super(message);
    this.name = 'BudgetBakersError';
  }

  toApiError(): ApiError {
    return {
      type: this.type,
      message: this.message,
      statusCode: this.statusCode,
      details: this.details,
      retryAfter: this.retryAfter,
    };
  }
}

/**
 * Error factory functions
 */
export const createNetworkError = (message: string, details?: unknown) =>
  new BudgetBakersError('NetworkError', message, undefined, details);

export const createAuthError = (message: string = 'Authentication failed') =>
  new BudgetBakersError('AuthenticationError', message, 401);

export const createRateLimitError = (message: string = 'Rate limit exceeded', retryAfter?: number) =>
  new BudgetBakersError('RateLimitError', message, 429, undefined, retryAfter);

export const createValidationError = (message: string, details?: unknown) =>
  new BudgetBakersError('ValidationError', message, 400, details);

export const createNotFoundError = (message: string = 'Resource not found') =>
  new BudgetBakersError('NotFoundError', message, 404);

export const createServerError = (message: string, statusCode: number = 500) =>
  new BudgetBakersError('ServerError', message, statusCode);

export const createUnknownError = (message: string, details?: unknown) =>
  new BudgetBakersError('UnknownError', message, undefined, details);

/**
 * API error response body
 */
interface ApiErrorResponse {
  error: string;
}

/**
 * Parse HTTP response errors
 */
export const parseHttpError = (
  status: number,
  errorBody: ApiErrorResponse | string,
  retryAfter?: string | null
): BudgetBakersError => {
  const message = typeof errorBody === 'string' ? errorBody : errorBody.error;
  const retryAfterSeconds = retryAfter ? parseInt(retryAfter, 10) : undefined;

  switch (status) {
    case 401:
    case 403:
      return createAuthError(message);
    case 404:
      return createNotFoundError(message);
    case 429:
      return createRateLimitError(message, retryAfterSeconds);
    case 400:
      return createValidationError(message);
    default:
      if (status >= 500) {
        return createServerError(message, status);
      }
      return createUnknownError(`HTTP ${status}: ${message}`, { status });
  }
};
