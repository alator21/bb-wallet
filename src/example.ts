/**
 * Example usage of the Budget Bakers Wallet API wrapper
 * Functional style - functions take client as first parameter
 */

import { createClient, getUser, listAccounts, getAccount, createTransaction } from './index.ts';

// Create a client instance
const client = createClient({
  apiToken: 'your-api-token-here',
  // baseUrl: 'https://rest.budgetbakers.com/wallet', // Optional, this is the default
});

// Example: Get user info
const userResult = await getUser(client);

if (userResult.success) {
  console.log('User:', userResult.data);
} else {
  console.error('Error:', userResult.error);
}

// Example: List accounts with pagination
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

// Example: Get specific account
const accountResult = await getAccount(client, 'account-id-123');

if (accountResult.success) {
  console.log('Account:', accountResult.data);
} else {
  console.error('Error:', accountResult.error);
}

// Example: Create a transaction
const transactionResult = await createTransaction(client, {
  amount: 100.50,
  description: 'Coffee',
  // ... other fields
});

if (transactionResult.success) {
  console.log('Created transaction:', transactionResult.data);
} else {
  console.error('Error:', transactionResult.error);
}
