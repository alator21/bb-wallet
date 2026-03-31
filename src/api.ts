/**
 * API Functions - Blueprint
 *
 * Each function takes a Client as the first parameter
 * and returns a Promise<Result<T>>
 */

import { Effect } from 'effect';
import type { Client } from './client.ts';
import { request, runEffect } from './client.ts';
import type { Result, PaginationParams, PaginatedResponse } from './types.ts';

/**
 * Example: Get user info
 */
export async function getUser(client: Client): Promise<Result<{ id: string; email: string }>> {
  const effect = request<{ id: string; email: string }>(client, '/user');
  return runEffect(effect);
}

/**
 * Example: List accounts with pagination
 */
export async function listAccounts(
  client: Client,
  params?: PaginationParams
): Promise<Result<PaginatedResponse<unknown>>> {
  const queryParams = new URLSearchParams();
  if (params?.limit) queryParams.set('limit', params.limit.toString());
  if (params?.offset) queryParams.set('offset', params.offset.toString());

  const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
  const effect = request<{ data: unknown[]; nextOffset?: number }>(
    client,
    `/accounts${query}`
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
 * Example: Get account by ID
 */
export async function getAccount(
  client: Client,
  id: string
): Promise<Result<unknown>> {
  const effect = request<unknown>(client, `/accounts/${id}`);
  return runEffect(effect);
}

/**
 * Example: Create a transaction
 */
export async function createTransaction(
  client: Client,
  data: unknown
): Promise<Result<unknown>> {
  const effect = request<unknown>(client, '/transactions', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return runEffect(effect);
}

/**
 * Example: Update a transaction
 */
export async function updateTransaction(
  client: Client,
  id: string,
  data: unknown
): Promise<Result<unknown>> {
  const effect = request<unknown>(client, `/transactions/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return runEffect(effect);
}

/**
 * Example: Delete a transaction
 */
export async function deleteTransaction(
  client: Client,
  id: string
): Promise<Result<void>> {
  const effect = request<void>(client, `/transactions/${id}`, {
    method: 'DELETE',
  });
  return runEffect(effect);
}

// TODO: Add more API functions as we learn the actual endpoints:
// - listTransactions
// - getTransaction
// - listCategories
// - getCategory
// - listBudgets
// - getBudget
// - etc.
