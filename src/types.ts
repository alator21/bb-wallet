/**
 * API Error types
 */
export type ApiErrorType =
  | 'NetworkError'
  | 'AuthenticationError'
  | 'RateLimitError'
  | 'ValidationError'
  | 'NotFoundError'
  | 'ServerError'
  | 'UnknownError';

export interface ApiError {
  type: ApiErrorType;
  message: string;
  statusCode?: number;
  details?: unknown;
}

/**
 * Result types for API responses
 */
export type Success<T> = {
  success: true;
  data: T;
};

export type Failure<E = ApiError> = {
  success: false;
  error: E;
};

export type Result<T, E = ApiError> = Success<T> | Failure<E>;

/**
 * Client configuration
 */
export interface BudgetBakersConfig {
  baseUrl?: string;
  apiToken: string;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  limit?: number;
  offset?: number;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  nextOffset?: number;
  hasMore: boolean;
}
