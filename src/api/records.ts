/**
 * Records API
 *
 * Functions for managing financial transaction records
 */

import type { Client } from '../client.ts';
import { request } from '../client.ts';
import type { Result, AgentHint, AmountWithCurrency, LabelEmbed, CategoryEmbed } from '../types.ts';
import type { TextFilter, RangeFilter } from '../utils/filters.ts';
import { QueryBuilder } from '../utils/query-builder.ts';

/**
 * Record photo attachment
 */
export interface RecordPhoto {
  /**
   * Timestamp when the photo was created
   */
  createdAt: string;
  /**
   * Temporary signed URL of the photo (valid for limited time)
   */
  temporaryUrl: string;
}

/**
 * Record place/location information
 */
export interface RecordPlace {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  placeTypes: number[];
}

/**
 * Payment method type
 */
export type PaymentType =
  | 'cash'
  | 'debit_card'
  | 'credit_card'
  | 'transfer'
  | 'voucher'
  | 'mobile_payment'
  | 'web_payment';

/**
 * Transaction state
 */
export type RecordState =
  | 'reconciled'
  | 'cleared'
  | 'uncleared'
  | 'void'
  | 'waitForAssign';

/**
 * Transaction type
 */
export type RecordType = 'income' | 'expense';

/**
 * Financial transaction record
 */
export interface Record {
  /**
   * Unique identifier
   */
  id: string;

  /**
   * Account ID this record belongs to
   */
  accountId: string;

  /**
   * Transaction amount in its original currency (before conversion).
   * May differ from baseAmount for foreign currency transactions.
   */
  amount: AmountWithCurrency;

  /**
   * Transaction amount converted to the account's base currency.
   * Use this for calculations and filtering.
   */
  baseAmount: AmountWithCurrency;

  /**
   * Full category data embedded in response
   */
  category: CategoryEmbed | null;

  /**
   * Date of the transaction
   */
  recordDate: string;

  /**
   * Transaction type: income (money received) or expense (money spent)
   */
  recordType: RecordType;

  /**
   * Transaction state
   */
  recordState: RecordState;

  createdAt: string;
  updatedAt: string;

  /**
   * Labels attached to this record
   */
  labels: LabelEmbed[];

  /**
   * Photos attached to this record
   */
  photos: RecordPhoto[];

  // Optional fields (only present when set)
  note?: string;

  /**
   * Payee name (for expense records)
   */
  payee?: string;

  /**
   * Payer name (for income records)
   */
  payer?: string;

  /**
   * Payment method
   */
  paymentType?: PaymentType;

  place?: RecordPlace;
}

/**
 * Records list response
 */
export interface RecordsResponse {
  limit: number;
  nextOffset?: number;
  offset: number;
  records: Record[];
  /**
   * The effective date range filter applied to the query, as array of operator-prefixed timestamps.
   * Example: ["gte.2024-01-01T00:00:00Z", "lt.2025-01-01T00:00:00Z"]
   */
  recordDateRange: [string, string];
  agentHints?: AgentHint[] | null;
}

/**
 * Records by ID response
 */
export interface RecordsByIdResponse {
  count: number;
  records: Record[];
  agentHints?: AgentHint[] | null;
}

/**
 * Sort direction and field for records
 */
export type RecordSortBy =
  | '+recordDate'
  | '-recordDate'
  | '+amount'
  | '-amount'
  | '+createdAt'
  | '-createdAt'
  | '+updatedAt'
  | '-updatedAt';

/**
 * Query parameters for listing records
 */
export interface RecordsQueryParams {
  /**
   * Filter by account ID (exact match). When omitted, returns records from all accounts.
   * Use /accounts to find valid account IDs.
   */
  accountId?: string;

  /**
   * Filter by transaction date. Requires range prefix.
   * Maximal allowed record date range: 370 days.
   * When bounds incomplete, default intervals apply:
   * - only gt/gte → 3 months forward
   * - only lt/lte → 3 months back
   * - no bounds → last 3 months from now
   */
  recordDate?: RangeFilter;

  /**
   * Maximum number of items to return (1-200, default: 30)
   */
  limit?: number;

  /**
   * Number of items to skip (default: 0). Used for pagination.
   */
  offset?: number;

  /**
   * Enable AI agent hints in response. When true, includes structured hints
   * to help AI agents understand the response and take follow-up actions.
   */
  agentHints?: boolean;

  /**
   * Filter by category ID (exact match)
   */
  categoryId?: string;

  /**
   * Filter by label ID - returns records that have this label
   */
  labelId?: string;

  /**
   * Filter by note.
   */
  note?: TextFilter[];

  /**
   * Filter expense records by payee.
   */
  payee?: TextFilter[];

  /**
   * Filter income records by payer.
   */
  payer?: TextFilter[];

  /**
   * Filter by transaction amount. Applied to baseAmount.value (decimal format).
   */
  amount?: RangeFilter;

  /**
   * Filter by creation timestamp.
   */
  createdAt?: RangeFilter;

  /**
   * Filter by last sync timestamp.
   */
  updatedAt?: RangeFilter;

  /**
   * Sort results by field. Prefix with + for ascending, - for descending.
   * Supported fields: recordDate, amount, createdAt, updatedAt.
   */
  sortBy?: RecordSortBy;
}

/**
 * List all financial transaction records with pagination and filtering
 */
export async function listRecords(
  client: Client,
  params?: RecordsQueryParams
): Promise<Result<RecordsResponse>> {
  const query = QueryBuilder.create()
    .add('accountId', params?.accountId)
    .addRangeFilter('recordDate', params?.recordDate)
    .add('limit', params?.limit)
    .add('offset', params?.offset)
    .add('agentHints', params?.agentHints)
    .add('categoryId', params?.categoryId)
    .add('labelId', params?.labelId)
    .addTextFilters('note', params?.note)
    .addTextFilters('payee', params?.payee)
    .addTextFilters('payer', params?.payer)
    .addRangeFilter('amount', params?.amount)
    .addRangeFilter('createdAt', params?.createdAt)
    .addRangeFilter('updatedAt', params?.updatedAt)
    .add('sortBy', params?.sortBy)
    .build();

  return request<RecordsResponse>(client, `/v1/api/records${query}`);
}

/**
 * Get financial transaction records by their unique IDs.
 * Use this endpoint when you already know which records you want to retrieve.
 * Unlike /records, this endpoint does not require a time range filter.
 *
 * @param client - The API client
 * @param ids - Array of record IDs (max 30)
 * @param agentHints - Enable AI agent hints in response
 */
export async function getRecordsByIds(
  client: Client,
  ids: string[],
  agentHints?: boolean
): Promise<Result<RecordsByIdResponse>> {
  if (ids.length === 0) {
    throw new Error('At least one record ID is required');
  }

  if (ids.length > 30) {
    throw new Error('Maximum 30 record IDs allowed');
  }

  const query = QueryBuilder.create()
    .addArray('id', ids)
    .add('agentHints', agentHints)
    .build();

  return request<RecordsByIdResponse>(client, `/v1/api/records/by-id${query}`);
}
