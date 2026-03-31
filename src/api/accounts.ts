/**
 * Accounts API
 *
 * Functions for managing accounts
 */

import { Effect } from 'effect';
import type { Client } from '../client.ts';
import { request, runEffect } from '../client.ts';
import type { Result, PaginationParams, PaginatedResponse } from '../types.ts';

/**
 * Account entity type (placeholder - replace with actual API types)
 */
export interface Account {
  id: string;
  name: string;
  // TODO: Add actual account fields from API
}

/**
 * List all accounts with pagination
 */
export async function listAccounts(
  client: Client,
  params?: PaginationParams
): Promise<Result<PaginatedResponse<Account>>> {
  const queryParams = new URLSearchParams();
  if (params?.limit) queryParams.set('limit', params.limit.toString());
  if (params?.offset) queryParams.set('offset', params.offset.toString());

  const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
  const effect = request<{ data: Account[]; nextOffset?: number }>(
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
 * Get account by ID
 */
export async function getAccount(
  client: Client,
  id: string
): Promise<Result<Account>> {
  const effect = request<Account>(client, `/accounts/${id}`);
  return runEffect(effect);
}

/**
 * Create a new account
 */
export async function createAccount(
  client: Client,
  data: Omit<Account, 'id'>
): Promise<Result<Account>> {
  const effect = request<Account>(client, '/accounts', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return runEffect(effect);
}

/**
 * Update an existing account
 */
export async function updateAccount(
  client: Client,
  id: string,
  data: Partial<Omit<Account, 'id'>>
): Promise<Result<Account>> {
  const effect = request<Account>(client, `/accounts/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return runEffect(effect);
}

/**
 * Delete an account
 */
export async function deleteAccount(
  client: Client,
  id: string
): Promise<Result<void>> {
  const effect = request<void>(client, `/accounts/${id}`, {
    method: 'DELETE',
  });
  return runEffect(effect);
}
