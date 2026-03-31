/**
 * Example usage of the Budget Bakers Wallet API wrapper
 */

import BudgetBakersWallet from './index.ts';

// Initialize the client
const client = new BudgetBakersWallet({
  apiToken: 'your-api-token-here',
  // baseUrl: 'https://rest.budgetbakers.com/wallet', // Optional, this is the default
});

// Example: Get user info
const userResult = await client.getUser();

if (userResult.success) {
  console.log('User:', userResult.data);
} else {
  console.error('Error:', userResult.error);
}

// Example: List accounts with pagination
const accountsResult = await client.listAccounts({ limit: 50, offset: 0 });

if (accountsResult.success) {
  console.log('Accounts:', accountsResult.data.data);
  console.log('Has more:', accountsResult.data.hasMore);
  if (accountsResult.data.nextOffset) {
    console.log('Next offset:', accountsResult.data.nextOffset);
  }
} else {
  console.error('Error:', accountsResult.error);
}
