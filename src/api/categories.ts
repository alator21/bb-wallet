/**
 * Categories API
 *
 * Functions for managing categories
 */

import { Effect } from 'effect';
import type { Client } from '../client.ts';
import { request, runEffect } from '../client.ts';
import type { Result, PaginationParams, PaginatedResponse } from '../types.ts';

/**
 * Category entity type (placeholder - replace with actual API types)
 */
export interface Category {
  id: string;
  name: string;
  // TODO: Add actual category fields from API
  // Examples: icon, color, parentId, type (income/expense), etc.
}

/**
 * List all categories with pagination
 */
export async function listCategories(
  client: Client,
  params?: PaginationParams
): Promise<Result<PaginatedResponse<Category>>> {
  const queryParams = new URLSearchParams();
  if (params?.limit) queryParams.set('limit', params.limit.toString());
  if (params?.offset) queryParams.set('offset', params.offset.toString());

  const query = queryParams.toString() ? `?${queryParams.toString()}` : '';
  const effect = request<{ data: Category[]; nextOffset?: number }>(
    client,
    `/categories${query}`
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
 * Get category by ID
 */
export async function getCategory(
  client: Client,
  id: string
): Promise<Result<Category>> {
  const effect = request<Category>(client, `/categories/${id}`);
  return runEffect(effect);
}

/**
 * Create a new category
 */
export async function createCategory(
  client: Client,
  data: Omit<Category, 'id'>
): Promise<Result<Category>> {
  const effect = request<Category>(client, '/categories', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return runEffect(effect);
}

/**
 * Update an existing category
 */
export async function updateCategory(
  client: Client,
  id: string,
  data: Partial<Omit<Category, 'id'>>
): Promise<Result<Category>> {
  const effect = request<Category>(client, `/categories/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return runEffect(effect);
}

/**
 * Delete a category
 */
export async function deleteCategory(
  client: Client,
  id: string
): Promise<Result<void>> {
  const effect = request<void>(client, `/categories/${id}`, {
    method: 'DELETE',
  });
  return runEffect(effect);
}
