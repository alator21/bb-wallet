/**
 * Example: Get API Usage Statistics
 *
 * Demonstrates how to retrieve API usage statistics for monitoring your API consumption.
 */

import { createClient } from '../src/client.ts';
import { getAPIUsageStats } from '../src/api/api-usage.ts';

// Initialize client with your API token
const client = createClient({
  apiToken: process.env.apiToken ?? 'your-token-here',
});

console.log('Fetching API usage statistics...\n');

// Example 1: Get last 30 days with daily granularity
console.log('=== Last 30 days (daily) ===');
const daily = await getAPIUsageStats(client, { period: '30days' });

if (!daily.success) {
  console.error('Error:', daily.error);
} else {
  console.log(`Period: ${daily.data.period}`);
  console.log(`Granularity: ${daily.data.granularity}`);
  console.log(`Date range: ${daily.data.from} to ${daily.data.to}`);
  console.log(`Total requests: ${daily.data.total}`);
  console.log(`\nDaily breakdown (showing first 5 days):`);

  daily.data.usage.slice(0, 5).forEach((entry) => {
    const date = new Date(entry.from).toISOString().split('T')[0];
    console.log(`  ${date}: ${entry.total} requests`);
  });
}

// Example 2: Get last 4 weeks with weekly granularity
console.log('\n=== Last 4 weeks (weekly) ===');
const weekly = await getAPIUsageStats(client, { period: '4weeks' });

if (!weekly.success) {
  console.error('Error:', weekly.error);
} else {
  console.log(`Total requests: ${weekly.data.total}`);
  console.log(`\nWeekly breakdown:`);

  weekly.data.usage.forEach((entry) => {
    const weekStart = new Date(entry.from).toISOString().split('T')[0];
    console.log(`  Week of ${weekStart}: ${entry.total} requests`);
  });
}

// Example 3: Get last 6 months with monthly granularity
console.log('\n=== Last 6 months (monthly) ===');
const monthly = await getAPIUsageStats(client, { period: '6months' });

if (!monthly.success) {
  console.error('Error:', monthly.error);
} else {
  console.log(`Total requests: ${monthly.data.total}`);
  console.log(`\nMonthly breakdown:`);

  monthly.data.usage.forEach((entry) => {
    const month = new Date(entry.from).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
    console.log(`  ${month}: ${entry.total} requests`);
  });
}
