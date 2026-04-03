/**
 * Example usage of the Budget Bakers Wallet API wrapper
 * Functional style - functions take client as first parameter
 */

import {
  createClient,
  listAccounts,
  listBudgets,
  listCategories,
  listGoals,
  listLabels,
  listRecords,
  getRecordsByIds,
  listRecordRules,
  listStandingOrders,
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
// Goals Examples
// ============================================================================

console.log("=== Goals ===");

// List goals with pagination
const goalsResult = await listGoals(client, { limit: 50, offset: 0 });

if (goalsResult.success) {
  console.log("Goals:", goalsResult.data.goals);
  console.log("Limit:", goalsResult.data.limit);
  console.log("Offset:", goalsResult.data.offset);
  console.log("Next offset:", goalsResult.data.nextOffset);
  console.log("Agent hints:", goalsResult.data.agentHints);

  // Metadata from response headers
  console.log("Metadata:", goalsResult.metadata);
  console.log(
    "Rate limit remaining:",
    goalsResult.metadata.rateLimitRemaining,
  );
  console.log("Sync in progress:", goalsResult.metadata.syncInProgress);

  // Example: Access first goal details
  const firstGoal = goalsResult.data.goals[0];
  if (firstGoal) {
    console.log("First goal name:", firstGoal.name);
    console.log("Target amount:", firstGoal.targetAmount);
    console.log("Initial amount:", firstGoal.initialAmount);
    console.log("Desired date:", firstGoal.desiredDate);
    console.log("State:", firstGoal.state);
    console.log("Color:", firstGoal.color);
    console.log("Note:", firstGoal.note);
  }
} else {
  console.error("Error:", goalsResult.error);
}

// Example with filters
const filteredGoals = await listGoals(client, {
  name: [{ containsInsensitive: "vacation" }],
  createdAt: { gte: "2024-01-01" },
});

if (filteredGoals.success) {
  console.log("Filtered goals:", filteredGoals.data.goals);
}

// ============================================================================
// Labels Examples
// ============================================================================

console.log("=== Labels ===");

// List labels with pagination
const labelsResult = await listLabels(client, { limit: 50, offset: 0 });

if (labelsResult.success) {
  console.log("Labels:", labelsResult.data.labels);
  console.log("Limit:", labelsResult.data.limit);
  console.log("Offset:", labelsResult.data.offset);
  console.log("Next offset:", labelsResult.data.nextOffset);
  console.log("Agent hints:", labelsResult.data.agentHints);

  // Metadata from response headers
  console.log("Metadata:", labelsResult.metadata);
  console.log(
    "Rate limit remaining:",
    labelsResult.metadata.rateLimitRemaining,
  );
  console.log("Sync in progress:", labelsResult.metadata.syncInProgress);

  // Example: Access first label details
  const firstLabel = labelsResult.data.labels[0];
  if (firstLabel) {
    console.log("First label name:", firstLabel.name);
    console.log("Label color:", firstLabel.color);
    console.log("Archived:", firstLabel.archived);
    console.log("Created at:", firstLabel.createdAt);
  }
} else {
  console.error("Error:", labelsResult.error);
}

// Example with filters
const filteredLabels = await listLabels(client, {
  name: [{ containsInsensitive: "important" }],
  createdAt: { gte: "2024-01-01" },
});

if (filteredLabels.success) {
  console.log("Filtered labels:", filteredLabels.data.labels);
}

// ============================================================================
// Record Rules Examples
// ============================================================================

console.log("=== Record Rules ===");

// List record rules with pagination
const rulesResult = await listRecordRules(client, { limit: 50, offset: 0 });

if (rulesResult.success) {
  console.log("Record Rules:", rulesResult.data.recordRules);
  console.log("Limit:", rulesResult.data.limit);
  console.log("Offset:", rulesResult.data.offset);
  console.log("Next offset:", rulesResult.data.nextOffset);
  console.log("Agent hints:", rulesResult.data.agentHints);

  // Metadata from response headers
  console.log("Metadata:", rulesResult.metadata);
  console.log(
    "Rate limit remaining:",
    rulesResult.metadata.rateLimitRemaining,
  );
  console.log("Sync in progress:", rulesResult.metadata.syncInProgress);

  // Example: Access first rule details
  const firstRule = rulesResult.data.recordRules[0];
  if (firstRule) {
    console.log("First rule name:", firstRule.name);
    console.log("Keywords:", firstRule.keywords);
    console.log("Category:", firstRule.category.name);
    console.log("Labels:", firstRule.labels.map(l => l.name).join(", "));
    console.log("From Account ID:", firstRule.fromAccountId);
    console.log("To Account ID:", firstRule.toAccountId);
  }
} else {
  console.error("Error:", rulesResult.error);
}

// Example with filters
const filteredRules = await listRecordRules(client, {
  name: [{ containsInsensitive: "grocery" }],
  createdAt: { gte: "2024-01-01" },
});

if (filteredRules.success) {
  console.log("Filtered record rules:", filteredRules.data.recordRules);
}

// ============================================================================
// Standing Orders Examples
// ============================================================================

console.log("=== Standing Orders ===");

// List standing orders with pagination
const ordersResult = await listStandingOrders(client, { limit: 50, offset: 0 });

if (ordersResult.success) {
  console.log("Standing Orders:", ordersResult.data.standingOrders);
  console.log("Limit:", ordersResult.data.limit);
  console.log("Offset:", ordersResult.data.offset);
  console.log("Next offset:", ordersResult.data.nextOffset);
  console.log("Agent hints:", ordersResult.data.agentHints);

  // Metadata from response headers
  console.log("Metadata:", ordersResult.metadata);
  console.log(
    "Rate limit remaining:",
    ordersResult.metadata.rateLimitRemaining,
  );
  console.log("Sync in progress:", ordersResult.metadata.syncInProgress);

  // Example: Access first standing order details
  const firstOrder = ordersResult.data.standingOrders[0];
  if (firstOrder) {
    console.log("First order name:", firstOrder.name);
    console.log("Type:", firstOrder.type);
    console.log("Amount:", firstOrder.amount, firstOrder.currencyCode);
    console.log("Recurrence rule:", firstOrder.recurrenceRule);
    console.log("Generate from date:", firstOrder.generateFromDate);
    console.log("Manual payment:", firstOrder.manualPayment);
    console.log("Category ID:", firstOrder.categoryId);
    if (firstOrder.labels && firstOrder.labels.length > 0) {
      console.log("Labels:", firstOrder.labels.map(l => l.name).join(", "));
    }
    console.log("Payee:", firstOrder.payee);
    console.log("Payer:", firstOrder.payer);
  }
} else {
  console.error("Error:", ordersResult.error);
}

// Example with filters
const filteredOrders = await listStandingOrders(client, {
  name: [{ containsInsensitive: "rent" }],
  currencyCode: "USD",
  createdAt: { gte: "2024-01-01" },
});

if (filteredOrders.success) {
  console.log("Filtered standing orders:", filteredOrders.data.standingOrders);
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
