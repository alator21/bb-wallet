/**
 * Example: Managing Standing Orders (Recurring Payments)
 *
 * Demonstrates how to retrieve and filter recurring payment standing orders.
 */

import { createClient, listStandingOrders } from '../src/index.ts';

// Initialize client with your API token
const client = createClient({
  apiToken: process.env.apiToken ?? 'your-token-here',
});

console.log('Fetching standing orders...\n');

// Example 1: Get all standing orders
console.log('=== All Standing Orders ===');
const allOrders = await listStandingOrders(client, {
  limit: 100,
  agentHints: true,
});

if (allOrders.success) {
  console.log(`Found ${allOrders.data.standingOrders.length} standing orders`);
  console.log(`Rate limit remaining: ${allOrders.metadata.rateLimitRemaining}`);

  allOrders.data.standingOrders.forEach((order) => {
    console.log(`\n${order.name}:`);
    console.log(`  Type: ${order.type}`);
    console.log(`  Amount: ${order.amount} ${order.currencyCode}`);
    console.log(`  Recurrence: ${order.recurrenceRule}`);
    console.log(`  Generate from: ${order.generateFromDate}`);
    console.log(`  Manual payment: ${order.manualPayment}`);
    console.log(`  Category ID: ${order.categoryId}`);

    if (order.labels && order.labels.length > 0) {
      console.log(`  Labels: ${order.labels.map(l => l.name).join(', ')}`);
    }

    if (order.payee) {
      console.log(`  Payee: ${order.payee}`);
    }

    if (order.payer) {
      console.log(`  Payer: ${order.payer}`);
    }

    if (order.note) {
      console.log(`  Note: ${order.note}`);
    }
  });
} else {
  console.error('Error:', allOrders.error);
}

// Example 2: Filter by name (e.g., rent payments)
console.log('\n=== Rent-related Standing Orders ===');
const rentOrders = await listStandingOrders(client, {
  name: [{ containsInsensitive: 'rent' }],
});

if (rentOrders.success) {
  console.log(`Found ${rentOrders.data.standingOrders.length} rent-related orders`);
  rentOrders.data.standingOrders.forEach((order) => {
    console.log(`  - ${order.name}: ${order.amount} ${order.currencyCode}`);
    console.log(`    Recurrence: ${order.recurrenceRule}`);
  });
} else {
  console.error('Error:', rentOrders.error);
}

// Example 3: Filter by currency
console.log('\n=== USD Standing Orders ===');
const usdOrders = await listStandingOrders(client, {
  currencyCode: 'USD',
  limit: 50,
});

if (usdOrders.success) {
  console.log(`Found ${usdOrders.data.standingOrders.length} USD standing orders`);
  usdOrders.data.standingOrders.forEach((order) => {
    console.log(`  - ${order.name}: $${order.amount}`);
  });
} else {
  console.error('Error:', usdOrders.error);
}

// Example 4: Get specific standing orders by IDs
console.log('\n=== Get Specific Standing Orders by IDs ===');
const specificOrders = await listStandingOrders(client, {
  id: ['order-id-1', 'order-id-2'],
});

if (specificOrders.success) {
  console.log(`Found ${specificOrders.data.standingOrders.length} standing orders`);
  specificOrders.data.standingOrders.forEach((order) => {
    console.log(`  - ${order.name} (ID: ${order.id})`);
  });
} else {
  console.error('Error:', specificOrders.error);
}

// Example 5: Get recently created standing orders
console.log('\n=== Recently Created Standing Orders ===');
const recentDate = new Date();
recentDate.setDate(recentDate.getDate() - 30);

const recentOrders = await listStandingOrders(client, {
  createdAt: { gte: recentDate.toISOString() },
  limit: 20,
});

if (recentOrders.success) {
  console.log(`Found ${recentOrders.data.standingOrders.length} orders created in the last 30 days`);
  recentOrders.data.standingOrders.forEach((order) => {
    const created = new Date(order.createdAt).toLocaleDateString();
    console.log(`  - ${order.name} (created: ${created})`);
  });
} else {
  console.error('Error:', recentOrders.error);
}

// Example 6: Analyze standing orders
console.log('\n=== Standing Orders Analysis ===');
const allOrdersForAnalysis = await listStandingOrders(client, { limit: 200 });

if (allOrdersForAnalysis.success) {
  const incomeOrders = allOrdersForAnalysis.data.standingOrders.filter(o => o.type === 'income');
  const expenseOrders = allOrdersForAnalysis.data.standingOrders.filter(o => o.type === 'expense');
  const manualOrders = allOrdersForAnalysis.data.standingOrders.filter(o => o.manualPayment);

  console.log(`Total standing orders: ${allOrdersForAnalysis.data.standingOrders.length}`);
  console.log(`Income orders: ${incomeOrders.length}`);
  console.log(`Expense orders: ${expenseOrders.length}`);
  console.log(`Manual payment orders: ${manualOrders.length}`);

  // Calculate total monthly expenses (rough estimate)
  const monthlyExpenses = expenseOrders.reduce((sum, order) => {
    // Simple heuristic: if "FREQ=MONTHLY" is in the rule, add the amount
    if (order.recurrenceRule.includes('FREQ=MONTHLY')) {
      return sum + parseFloat(order.amount);
    }
    return sum;
  }, 0);

  console.log(`\nEstimated monthly recurring expenses: ${monthlyExpenses.toFixed(2)}`);
} else {
  console.error('Error:', allOrdersForAnalysis.error);
}
