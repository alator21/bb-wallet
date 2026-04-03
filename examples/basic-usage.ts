/**
 * Example usage of the Budget Bakers Wallet API wrapper
 * Functional style - functions take client as first parameter
 */

import {
  createClient,
  listAccounts,
  listBudgets,
  listCategories,
  listRecords,
  getRecordsByIds,
  getAPIUsageStats,
} from "../src/index.ts";

// Create a client instance
const client = createClient({
  apiToken: process.env.apiToken ?? "add your token here",
  // baseUrl: 'https://rest.budgetbakers.com/wallet', // Optional, this is the default
});

// ============================================================================
// Accounts Examples
// ============================================================================

console.log("=== Accounts ===");

// List accounts with pagination
const accountsResult = await listAccounts(client, { limit: 50, offset: 0 });

if (accountsResult.success) {
  console.log("Accounts:", accountsResult.data.accounts);
  console.log("Limit:", accountsResult.data.limit);
  console.log("Offset:", accountsResult.data.offset);
  console.log("Next offset:", accountsResult.data.nextOffset);
  console.log("Agent hints:", accountsResult.data.agentHints);

  // Metadata from response headers
  console.log("Metadata:", accountsResult.metadata);
  console.log(
    "Rate limit remaining:",
    accountsResult.metadata.rateLimitRemaining,
  );
  console.log("Sync in progress:", accountsResult.metadata.syncInProgress);

  // Example: Access first account details
  const firstAccount = accountsResult.data.accounts[0];
  if (firstAccount) {
    console.log("First account name:", firstAccount.name);
    console.log("Account type:", firstAccount.accountType);
    console.log("Balance:", firstAccount.initialBalance);
  }
} else {
  console.error("Error:", accountsResult.error);
}

// Example with filters
const filteredResult = await listAccounts(client, {
  name: [{ containsInsensitive: "savings" }],
  accountType: "SavingAccount",
  currencyCode: "USD",
  createdAt: { gte: "2024-01-01", lt: "2024-12-31" },
});

if (filteredResult.success) {
  console.log("Filtered accounts:", filteredResult.data.accounts);
}

// ============================================================================
// Budgets Examples
// ============================================================================

console.log("=== Budgets ===");

// List budgets with pagination
const budgetsResult = await listBudgets(client, { limit: 50, offset: 0 });

if (budgetsResult.success) {
  console.log("Budgets:", budgetsResult.data.budgets);
  console.log("Limit:", budgetsResult.data.limit);
  console.log("Offset:", budgetsResult.data.offset);
  console.log("Next offset:", budgetsResult.data.nextOffset);
  console.log("Agent hints:", budgetsResult.data.agentHints);

  // Metadata from response headers
  console.log("Metadata:", budgetsResult.metadata);
  console.log(
    "Rate limit remaining:",
    budgetsResult.metadata.rateLimitRemaining,
  );
  console.log("Sync in progress:", budgetsResult.metadata.syncInProgress);

  // Example: Access first budget details
  const firstBudget = budgetsResult.data.budgets[0];
  if (firstBudget) {
    console.log("First budget name:", firstBudget.name);
    console.log("Budget amount:", firstBudget.amount);
    console.log("Currency:", firstBudget.currencyCode);
    console.log("Period:", firstBudget.startDate, "to", firstBudget.endDate);
    console.log("Labels:", firstBudget.labels);
  }
} else {
  console.error("Error:", budgetsResult.error);
}

// Example with filters
const filteredBudgets = await listBudgets(client, {
  name: [{ containsInsensitive: "monthly" }],
  currencyCode: "USD",
  createdAt: { gte: "2024-01-01", lt: "2024-12-31" },
});

if (filteredBudgets.success) {
  console.log("Filtered budgets:", filteredBudgets.data.budgets);
}

// ============================================================================
// Categories Examples
// ============================================================================

console.log("=== Categories ===");

// List categories with pagination
const categoriesResult = await listCategories(client, { limit: 50, offset: 0 });

if (categoriesResult.success) {
  console.log("Categories:", categoriesResult.data.categories);
  console.log("Limit:", categoriesResult.data.limit);
  console.log("Offset:", categoriesResult.data.offset);
  console.log("Next offset:", categoriesResult.data.nextOffset);
  console.log("Agent hints:", categoriesResult.data.agentHints);

  // Metadata from response headers
  console.log("Metadata:", categoriesResult.metadata);
  console.log(
    "Rate limit remaining:",
    categoriesResult.metadata.rateLimitRemaining,
  );
  console.log("Sync in progress:", categoriesResult.metadata.syncInProgress);

  // Example: Access first category details
  const firstCategory = categoriesResult.data.categories[0];
  if (firstCategory) {
    console.log("First category name:", firstCategory.name);
    console.log("Category color:", firstCategory.color);
    console.log("Icon name:", firstCategory.iconName);
    console.log("Archived:", firstCategory.archived);
    console.log("Custom category:", firstCategory.customCategory);
  }
} else {
  console.error("Error:", categoriesResult.error);
}

// Example with filters
const filteredCategories = await listCategories(client, {
  name: [{ containsInsensitive: "food" }],
  createdAt: { gte: "2024-01-01" },
});

if (filteredCategories.success) {
  console.log("Filtered categories:", filteredCategories.data.categories);
}

// ============================================================================
// Records Examples
// ============================================================================

console.log("=== Records ===\\");

// List records with pagination
// Note: recordDate filter is applied automatically (defaults to last 3 months if not specified)
const recordsResult = await listRecords(client, {
  limit: 50,
  offset: 0,
  recordDate: { gte: "2024-01-01", lt: "2024-12-31" },
  sortBy: "-recordDate", // Sort by date descending (newest first)
});

if (recordsResult.success) {
  console.log("Records:", recordsResult.data.records);
  console.log("Limit:", recordsResult.data.limit);
  console.log("Offset:", recordsResult.data.offset);
  console.log("Next offset:", recordsResult.data.nextOffset);
  console.log("Applied date range:", recordsResult.data.recordDateRange);
  console.log("Agent hints:", recordsResult.data.agentHints);

  // Metadata from response headers
  console.log("Metadata:", recordsResult.metadata);
  console.log(
    "Rate limit remaining:",
    recordsResult.metadata.rateLimitRemaining,
  );
  console.log("Sync in progress:", recordsResult.metadata.syncInProgress);

  // Example: Access first record details
  const firstRecord = recordsResult.data.records[0];
  if (firstRecord) {
    console.log("First record ID:", firstRecord.id);
    console.log("Record type:", firstRecord.recordType); // 'income' or 'expense'
    console.log("Amount:", firstRecord.amount);
    console.log("Base amount:", firstRecord.baseAmount);
    console.log("Date:", firstRecord.recordDate);
    console.log("Category:", firstRecord.category);
    console.log("Labels:", firstRecord.labels);
    console.log("Note:", firstRecord.note);
    console.log("Payee:", firstRecord.payee);
    console.log("Payment type:", firstRecord.paymentType);
  }
} else {
  console.error("Error:", recordsResult.error);
}

// Example: Filter records by account
const accountRecords = await listRecords(client, {
  accountId: "your-account-id-here",
  recordDate: { gte: "2024-01-01" },
  limit: 100,
});

if (accountRecords.success) {
  console.log("Account records:", accountRecords.data.records);
}

// Example: Filter expense records with complex filters
const expenseRecords = await listRecords(client, {
  recordDate: { gte: "2024-01-01", lt: "2024-12-31" },
  categoryId: "food-category-id",
  note: [{ containsInsensitive: "grocery" }],
  amount: { gte: "10.00", lt: "500.00" },
  sortBy: "-amount", // Sort by amount descending (largest first)
  limit: 50,
});

if (expenseRecords.success) {
  console.log("Filtered expense records:", expenseRecords.data.records);
}

// Example: Filter by payee (for expenses)
const vendorRecords = await listRecords(client, {
  payee: [{ containsInsensitive: "walmart" }],
  recordDate: { gte: "2024-01-01" },
  sortBy: "-recordDate",
});

if (vendorRecords.success) {
  console.log("Walmart records:", vendorRecords.data.records);
}

// Example: Filter income records by payer
const incomeRecords = await listRecords(client, {
  payer: [{ containsInsensitive: "employer" }],
  recordDate: { gte: "2024-01-01" },
  sortBy: "+recordDate", // Sort ascending (oldest first)
});

if (incomeRecords.success) {
  console.log("Income from employer:", incomeRecords.data.records);
}

// ============================================================================
// Get Records by IDs
// ============================================================================

console.log("=== Get Records by IDs ===\\");

// Get specific records by their IDs
const recordIds = ["record-id-1", "record-id-2", "record-id-3"];
const specificRecords = await getRecordsByIds(client, recordIds, true);

if (specificRecords.success) {
  console.log("Specific records:", specificRecords.data.records);
  console.log("Count:", specificRecords.data.count);
  console.log("Agent hints:", specificRecords.data.agentHints);

  // Access individual records
  for (const record of specificRecords.data.records) {
    console.log(`Record ${record.id}:`, record.amount, record.recordDate);
  }
} else {
  console.error("Error:", specificRecords.error);
}

// ============================================================================
// API Usage Stats
// ============================================================================

console.log("=== API Usage Stats ===");

// Get last 30 days with daily granularity
const usageStats = await getAPIUsageStats(client, { period: "30days" });

if (usageStats.success) {
  console.log("Period:", usageStats.data.period);
  console.log("Granularity:", usageStats.data.granularity);
  console.log("Date range:", usageStats.data.from, "to", usageStats.data.to);
  console.log("Total requests:", usageStats.data.total);

  // Display first 5 days of usage
  console.log("\nDaily usage (first 5 days):");
  usageStats.data.usage.slice(0, 5).forEach((entry) => {
    const date = new Date(entry.from).toISOString().split('T')[0];
    console.log(`  ${date}: ${entry.total} requests`);
  });

  // Metadata from response headers
  console.log("\nMetadata:", usageStats.metadata);
  console.log(
    "Rate limit remaining:",
    usageStats.metadata.rateLimitRemaining,
  );
} else {
  console.error("Error:", usageStats.error);
}

// Example: Get last 4 weeks with weekly granularity
const weeklyUsage = await getAPIUsageStats(client, { period: "4weeks" });

if (weeklyUsage.success) {
  console.log("\nWeekly usage stats:");
  weeklyUsage.data.usage.forEach((entry) => {
    const weekStart = new Date(entry.from).toISOString().split('T')[0];
    console.log(`  Week of ${weekStart}: ${entry.total} requests`);
  });
}
