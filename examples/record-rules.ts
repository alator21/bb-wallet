/**
 * Example: Managing Record Rules
 *
 * Demonstrates how to retrieve automatic categorization rules for financial records.
 */

import { createClient, listRecordRules } from '../src/index.ts';

// Initialize client with your API token
const client = createClient({
  apiToken: process.env.apiToken ?? 'your-token-here',
});

console.log('Fetching record rules...\n');

// Example 1: Get all record rules
console.log('=== All Record Rules ===');
const allRules = await listRecordRules(client, {
  limit: 100,
  agentHints: true,
});

if (allRules.success) {
  console.log(`Found ${allRules.data.recordRules.length} record rules`);
  console.log(`Rate limit remaining: ${allRules.metadata.rateLimitRemaining}`);

  allRules.data.recordRules.forEach((rule) => {
    console.log(`\n${rule.name}:`);
    console.log(`  ID: ${rule.id}`);
    console.log(`  Keywords: ${rule.keywords.join(', ')}`);
    console.log(`  Category: ${rule.category.name}`);

    if (rule.labels.length > 0) {
      console.log(`  Labels: ${rule.labels.map(l => l.name).join(', ')}`);
    }

    if (rule.fromAccountId) {
      console.log(`  From Account: ${rule.fromAccountId}`);
    }

    if (rule.toAccountId) {
      console.log(`  To Account: ${rule.toAccountId}`);
    }

    console.log(`  Created: ${new Date(rule.createdAt).toLocaleDateString()}`);
  });
} else {
  console.error('Error:', allRules.error);
}

// Example 2: Filter rules by name
console.log('\n=== Search Rules by Name ===');
const groceryRules = await listRecordRules(client, {
  name: [{ containsInsensitive: 'grocery' }],
});

if (groceryRules.success) {
  console.log(`Found ${groceryRules.data.recordRules.length} grocery-related rules`);
  groceryRules.data.recordRules.forEach((rule) => {
    console.log(`  - ${rule.name}`);
    console.log(`    Keywords: ${rule.keywords.join(', ')}`);
    console.log(`    Category: ${rule.category.name}`);
  });
} else {
  console.error('Error:', groceryRules.error);
}

// Example 3: Get specific rules by IDs
console.log('\n=== Get Specific Rules by IDs ===');
const specificRules = await listRecordRules(client, {
  id: ['rule-id-1', 'rule-id-2'],
});

if (specificRules.success) {
  console.log(`Found ${specificRules.data.recordRules.length} rules`);
  specificRules.data.recordRules.forEach((rule) => {
    console.log(`  - ${rule.name} (ID: ${rule.id})`);
  });
} else {
  console.error('Error:', specificRules.error);
}

// Example 4: Get recently created rules (last 30 days)
console.log('\n=== Recently Created Rules ===');
const recentDate = new Date();
recentDate.setDate(recentDate.getDate() - 30);

const recentRules = await listRecordRules(client, {
  createdAt: { gte: recentDate.toISOString() },
  limit: 20,
});

if (recentRules.success) {
  console.log(`Found ${recentRules.data.recordRules.length} rules created in the last 30 days`);
  recentRules.data.recordRules.forEach((rule) => {
    const created = new Date(rule.createdAt).toLocaleDateString();
    console.log(`  - ${rule.name} (created: ${created})`);
  });
} else {
  console.error('Error:', recentRules.error);
}

// Example 5: Analyze rules by category
console.log('\n=== Rules Grouped by Category ===');
const allRulesForAnalysis = await listRecordRules(client, { limit: 200 });

if (allRulesForAnalysis.success) {
  const rulesByCategory = new Map<string, number>();

  allRulesForAnalysis.data.recordRules.forEach((rule) => {
    const categoryName = rule.category.name;
    rulesByCategory.set(categoryName, (rulesByCategory.get(categoryName) || 0) + 1);
  });

  console.log('Rules per category:');
  Array.from(rulesByCategory.entries())
    .sort((a, b) => b[1] - a[1])
    .forEach(([category, count]) => {
      console.log(`  ${category}: ${count} rule(s)`);
    });
} else {
  console.error('Error:', allRulesForAnalysis.error);
}
