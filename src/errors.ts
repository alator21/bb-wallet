import { Data } from 'effect';
import type { ApiError, ApiErrorType } from './types.ts';

/**
 * Effect-compatible error class
 */
export class BudgetBakersError extends Data.TaggedError('BudgetBakersError')<{
  type: ApiErrorType;
  message: string;
  statusCode?: number;
  details?: unknown;
}> {
  toApiError(): ApiError {
    return {
      type: this.type,
      message: this.message,
      statusCode: this.statusCode,
      details: this.details,
    };
  }
}

/**
 * Error factory functions
 */
export const createNetworkError = (message: string, details?: unknown) =>
  new BudgetBakersError({
    type: 'NetworkError',
    message,
    details,
  });

export const createAuthError = (message: string = 'Authentication failed') =>
  new BudgetBakersError({
    type: 'AuthenticationError',
    message,
    statusCode: 401,
  });

export const createRateLimitError = (message: string = 'Rate limit exceeded') =>
  new BudgetBakersError({
    type: 'RateLimitError',
    message,
    statusCode: 429,
  });

export const createValidationError = (message: string, details?: unknown) =>
  new BudgetBakersError({
    type: 'ValidationError',
    message,
    statusCode: 400,
    details,
  });

export const createNotFoundError = (message: string = 'Resource not found') =>
  new BudgetBakersError({
    type: 'NotFoundError',
    message,
    statusCode: 404,
  });

export const createServerError = (message: string, statusCode: number = 500) =>
  new BudgetBakersError({
    type: 'ServerError',
    message,
    statusCode,
  });

export const createUnknownError = (message: string, details?: unknown) =>
  new BudgetBakersError({
    type: 'UnknownError',
    message,
    details,
  });

/**
 * Parse HTTP response errors
 */
export const parseHttpError = (status: number, statusText: string): BudgetBakersError => {
  switch (status) {
    case 401:
    case 403:
      return createAuthError(`Authentication failed: ${statusText}`);
    case 404:
      return createNotFoundError(statusText);
    case 429:
      return createRateLimitError(`Rate limit exceeded: ${statusText}`);
    case 400:
      return createValidationError(statusText);
    default:
      if (status >= 500) {
        return createServerError(statusText, status);
      }
      return createUnknownError(`HTTP ${status}: ${statusText}`, { status, statusText });
  }
};
