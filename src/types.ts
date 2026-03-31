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
 * Response metadata from API headers
 */
export interface ResponseMetadata {
  /**
   * Timestamp of last data modification (ISO 8601 UTC with millisecond precision)
   */
  lastDataChangeAt?: string;

  /**
   * Revision counter for change detection. Compare values to detect data changes between requests.
   */
  lastDataChangeRev?: string;

  /**
   * Maximum request capacity (hourly limit)
   */
  rateLimitLimit?: number;

  /**
   * Remaining request capacity in current window
   */
  rateLimitRemaining?: number;

  /**
   * If true, response data is valid but background sync is running — more changes may follow shortly.
   */
  syncInProgress?: boolean;
}

/**
 * Result types for API responses
 */
export type Success<T> = {
  success: true;
  data: T;
  metadata: ResponseMetadata;
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
