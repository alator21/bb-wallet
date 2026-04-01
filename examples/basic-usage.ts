/**
 * Example usage of the Budget Bakers Wallet API wrapper
 * Functional style - functions take client as first parameter
 */

import {
  createClient,
  listAccounts,
  listBudgets,
} from '../src/index.ts';

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
  console.log('Accounts:', accountsResult.data.accounts);
  console.log('Limit:', accountsResult.data.limit);
  console.log('Offset:', accountsResult.data.offset);
  console.log('Next offset:', accountsResult.data.nextOffset);
  console.log('Agent hints:', accountsResult.data.agentHints);

  // Metadata from response headers
  console.log('Metadata:', accountsResult.metadata);
  console.log('Rate limit remaining:', accountsResult.metadata.rateLimitRemaining);
  console.log('Sync in progress:', accountsResult.metadata.syncInProgress);

  // Example: Access first account details
  const firstAccount = accountsResult.data.accounts[0];
  if (firstAccount) {
    console.log('First account name:', firstAccount.name);
    console.log('Account type:', firstAccount.accountType);
    console.log('Balance:', firstAccount.initialBalance);
  }
} else {
  console.error('Error:', accountsResult.error);
}

// Example with filters
const filteredResult = await listAccounts(client, {
  name: [{ containsInsensitive: 'savings' }],
  accountType: 'SavingAccount',
  currencyCode: 'USD',
  createdAt: { gte: '2024-01-01', lt: '2024-12-31' },
});

if (filteredResult.success) {
  console.log('Filtered accounts:', filteredResult.data.accounts);
}

// ============================================================================
// Budgets Examples
// ============================================================================

console.log('=== Budgets ===');

// List budgets with pagination
const budgetsResult = await listBudgets(client, { limit: 50, offset: 0 });

if (budgetsResult.success) {
  console.log('Budgets:', budgetsResult.data.budgets);
  console.log('Limit:', budgetsResult.data.limit);
  console.log('Offset:', budgetsResult.data.offset);
  console.log('Next offset:', budgetsResult.data.nextOffset);
  console.log('Agent hints:', budgetsResult.data.agentHints);

  // Metadata from response headers
  console.log('Metadata:', budgetsResult.metadata);
  console.log('Rate limit remaining:', budgetsResult.metadata.rateLimitRemaining);
  console.log('Sync in progress:', budgetsResult.metadata.syncInProgress);

  // Example: Access first budget details
  const firstBudget = budgetsResult.data.budgets[0];
  if (firstBudget) {
    console.log('First budget name:', firstBudget.name);
    console.log('Budget amount:', firstBudget.amount);
    console.log('Currency:', firstBudget.currencyCode);
    console.log('Period:', firstBudget.startDate, 'to', firstBudget.endDate);
    console.log('Labels:', firstBudget.labels);
  }
} else {
  console.error('Error:', budgetsResult.error);
}

// Example with filters
const filteredBudgets = await listBudgets(client, {
  name: [{ containsInsensitive: 'monthly' }],
  currencyCode: 'USD',
  createdAt: { gte: '2024-01-01', lt: '2024-12-31' },
});

if (filteredBudgets.success) {
  console.log('Filtered budgets:', filteredBudgets.data.budgets);
}
