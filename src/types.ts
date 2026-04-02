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
  retryAfter?: number;
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

/**
 * Money and balance types
 */

/**
 * Amount with currency (used for transaction amounts)
 */
export interface AmountWithCurrency {
  /**
   * Currency code (ISO 4217)
   */
  currencyCode?: string;
  /**
   * Amount value in decimal format (e.g., 1234.56). Not in cents.
   */
  value?: number;
}

/**
 * Balance with currency (used for account balances)
 */
export interface BalanceWithCurrency {
  currencyCode?: string;
  value?: number;
}

/**
 * Date range for statistics
 */
export interface StatDateRange {
  min: string;
  max: string;
}

/**
 * Agent Hint types for AI-driven clients
 */

/**
 * Severity level of the agent hint
 */
export type AgentHintSeverity = 'info' | 'warning' | 'instruction';

/**
 * Hint category using dot-notation
 */
export type AgentHintType =
  | 'pagination.has_more'
  | 'result.partial_match'
  | 'result.empty'
  | 'param.inferred'
  | 'rate_limit.warning'
  | 'data.recency';

/**
 * Structured hint for AI agents to understand API responses and take appropriate actions
 */
export interface AgentHint {
  /**
   * Hint category using dot-notation
   */
  type: AgentHintType;

  /**
   * Indicates the nature/importance of the hint
   */
  severity: AgentHintSeverity;

  /**
   * Human/AI-readable description of the hint
   */
  text: string;

  /**
   * Action data for instruction hints. Only present when severity=instruction.
   * Contains url for fetching next page.
   */
  action?: {
    url: string;
  } | null;

  /**
   * Context data specific to the hint type. Structure varies based on the 'type' field.
   * See 'text' for human-readable explanation.
   */
  data?: Record<string, unknown> | null;
}
