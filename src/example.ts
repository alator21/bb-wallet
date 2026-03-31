/**
 * Example usage of the Budget Bakers Wallet API wrapper
 * Functional style - functions take client as first parameter
 */

import {
  createClient,
  // Accounts
  listAccounts,
  getAccount,
  // Records
  listRecords,
  getRecord,
  createRecord,
  // Categories
  listCategories,
  getCategory,
} from './index.ts';

// Create a client instance
const client = createClient({
  apiToken: 'your-api-token-here',
  // baseUrl: 'https://rest.budgetbakers.com/wallet', // Optional, this is the default
});

// ============================================================================
// Accounts Examples
// ============================================================================

console.log('=== Accounts ===');

// List accounts with pagination
const accountsResult = await listAccounts(client, { limit: 50, offset: 0 });

if (accountsResult.success) {
  console.log('Accounts:', accountsResult.data.data);
  console.log('Has more:', accountsResult.data.hasMore);
  if (accountsResult.data.nextOffset) {
    console.log('Next offset:', accountsResult.data.nextOffset);
  }
} else {
  console.error('Error:', accountsResult.error);
}

// Get specific account
const accountResult = await getAccount(client, 'account-id-123');

if (accountResult.success) {
  console.log('Account:', accountResult.data);
} else {
  console.error('Error:', accountResult.error);
}

// ============================================================================
// Records Examples
// ============================================================================

console.log('\n=== Records ===');

// List records with pagination
const recordsResult = await listRecords(client, { limit: 20, offset: 0 });

if (recordsResult.success) {
  console.log('Records:', recordsResult.data.data);
  console.log('Has more:', recordsResult.data.hasMore);
} else {
  console.error('Error:', recordsResult.error);
}

// Get specific record
const recordResult = await getRecord(client, 'record-id-456');

if (recordResult.success) {
  console.log('Record:', recordResult.data);
} else {
  console.error('Error:', recordResult.error);
}

// Create a new record
const newRecordResult = await createRecord(client, {
  amount: 100.50,
  note: 'Coffee and pastry',
  date: new Date().toISOString(),
});

if (newRecordResult.success) {
  console.log('Created record:', newRecordResult.data);
} else {
  console.error('Error:', newRecordResult.error);
}

// ============================================================================
// Categories Examples
// ============================================================================

console.log('\n=== Categories ===');

// List categories
const categoriesResult = await listCategories(client, { limit: 100 });

if (categoriesResult.success) {
  console.log('Categories:', categoriesResult.data.data);
} else {
  console.error('Error:', categoriesResult.error);
}

// Get specific category
const categoryResult = await getCategory(client, 'category-id-789');

if (categoryResult.success) {
  console.log('Category:', categoryResult.data);
} else {
  console.error('Error:', categoryResult.error);
}
