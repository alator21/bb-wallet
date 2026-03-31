/**
 * Records API
 *
 * Functions for managing records (transactions/entries)
 */

import { Effect } from 'effect';
import type { Client } from '../client.ts';
import { request, runEffect } from '../client.ts';
import type { Result, PaginationParams, PaginatedResponse } from '../types.ts';

/**
 * Record entity type (placeholder - replace with actual API types)
 */
export interface Record {
  id: string;
  amount: number;
  note?: string;
  date: string;
  // TODO: Add actual record fields from API
}

/**
 * Record filter options
 */
export interface RecordFilters extends PaginationParams {
  // TODO: Add filter fields based on API capabilities
  // Examples: dateFrom, dateTo, categoryId, accountId, etc.
}

/**
 * List all records with pagination and filters
 */
export async function listRecords(
  client: Client,
  params?: RecordFilters
): Promise<Result<PaginatedResponse<Record>>> {
  const queryParams = new URLSearchParams();
  if (params?.limit) queryParams.set('limit', params.limit.toString());
  if (params?.offset) queryParams.set('offset', params.offset.toString());
  // TODO: Add filter parameters

  const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
  const effect = request<{ data: Record[]; nextOffset?: number }>(
    client,
    `/records${query}`
  );

  return runEffect(
    Effect.map(effect, (response) => ({
      data: response.data,
      nextOffset: response.nextOffset,
      hasMore: response.nextOffset !== undefined,
    }))
  );
}

/**
 * Get record by ID
 */
export async function getRecord(
  client: Client,
  id: string
): Promise<Result<Record>> {
  const effect = request<Record>(client, `/records/${id}`);
  return runEffect(effect);
}

/**
 * Create a new record
 */
export async function createRecord(
  client: Client,
  data: Omit<Record, 'id'>
): Promise<Result<Record>> {
  const effect = request<Record>(client, '/records', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return runEffect(effect);
}

/**
 * Update an existing record
 */
export async function updateRecord(
  client: Client,
  id: string,
  data: Partial<Omit<Record, 'id'>>
): Promise<Result<Record>> {
  const effect = request<Record>(client, `/records/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return runEffect(effect);
}

/**
 * Delete a record
 */
export async function deleteRecord(
  client: Client,
  id: string
): Promise<Result<void>> {
  const effect = request<void>(client, `/records/${id}`, {
    method: 'DELETE',
  });
  return runEffect(effect);
}
