/**
 * Example: Managing Financial Goals
 *
 * Demonstrates how to retrieve and filter financial goals.
 */

import { createClient, listGoals } from '../src/index.ts';

// Initialize client with your API token
const client = createClient({
  apiToken: process.env.apiToken ?? 'your-token-here',
});

console.log('Fetching financial goals...\n');

// Example 1: Get all goals
console.log('=== All Goals ===');
const allGoals = await listGoals(client, {
  limit: 50,
  agentHints: true,
});

if (allGoals.success) {
  console.log(`Found ${allGoals.data.goals.length} goals`);
  console.log(`Rate limit remaining: ${allGoals.metadata.rateLimitRemaining}`);

  allGoals.data.goals.forEach((goal) => {
    console.log(`\n${goal.name}:`);
    console.log(`  Target: ${goal.targetAmount}`);
    console.log(`  Initial: ${goal.initialAmount}`);
    console.log(`  Desired date: ${goal.desiredDate}`);
    console.log(`  State: ${goal.state}`);
    console.log(`  Color: ${goal.color}`);
    if (goal.note) {
      console.log(`  Note: ${goal.note}`);
    }
  });
} else {
  console.error('Error:', allGoals.error);
}

// Example 2: Filter goals by name
console.log('\n=== Search Goals by Name ===');
const vacationGoals = await listGoals(client, {
  name: [{ containsInsensitive: 'vacation' }],
});

if (vacationGoals.success) {
  console.log(`Found ${vacationGoals.data.goals.length} vacation-related goals`);
  vacationGoals.data.goals.forEach((goal) => {
    console.log(`  - ${goal.name}: ${goal.targetAmount}`);
  });
} else {
  console.error('Error:', vacationGoals.error);
}

// Example 3: Filter by note content
console.log('\n=== Goals with "emergency" in notes ===');
const emergencyGoals = await listGoals(client, {
  note: [{ containsInsensitive: 'emergency' }],
});

if (emergencyGoals.success) {
  console.log(`Found ${emergencyGoals.data.goals.length} emergency-related goals`);
  emergencyGoals.data.goals.forEach((goal) => {
    console.log(`  - ${goal.name}`);
    if (goal.note) {
      console.log(`    Note: ${goal.note}`);
    }
  });
} else {
  console.error('Error:', emergencyGoals.error);
}

// Example 4: Get recently created goals
console.log('\n=== Recently Created Goals (last 30 days) ===');
const recentDate = new Date();
recentDate.setDate(recentDate.getDate() - 30);

const recentGoals = await listGoals(client, {
  createdAt: { gte: recentDate.toISOString() },
  limit: 10,
});

if (recentGoals.success) {
  console.log(`Found ${recentGoals.data.goals.length} recent goals`);
  recentGoals.data.goals.forEach((goal) => {
    const created = new Date(goal.createdAt).toLocaleDateString();
    console.log(`  - ${goal.name} (created: ${created})`);
  });
} else {
  console.error('Error:', recentGoals.error);
}

// Example 5: Get specific goals by IDs
console.log('\n=== Get Specific Goals by IDs ===');
const specificGoals = await listGoals(client, {
  id: ['goal-id-1', 'goal-id-2'],
});

if (specificGoals.success) {
  console.log(`Found ${specificGoals.data.goals.length} goals`);
  specificGoals.data.goals.forEach((goal) => {
    console.log(`  - ${goal.name} (ID: ${goal.id})`);
  });
} else {
  console.error('Error:', specificGoals.error);
}
