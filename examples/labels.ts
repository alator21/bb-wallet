/**
 * Example: Managing Labels/Hashtags
 *
 * Demonstrates how to retrieve and filter labels used for tagging records.
 */

import { createClient, listLabels } from '../src/index.ts';

// Initialize client with your API token
const client = createClient({
  apiToken: process.env.apiToken ?? 'your-token-here',
});

console.log('Fetching labels...\n');

// Example 1: Get all labels
console.log('=== All Labels ===');
const allLabels = await listLabels(client, {
  limit: 100,
  agentHints: true,
});

if (allLabels.success) {
  console.log(`Found ${allLabels.data.labels.length} labels`);
  console.log(`Rate limit remaining: ${allLabels.metadata.rateLimitRemaining}`);

  allLabels.data.labels.forEach((label) => {
    const status = label.archived ? '(archived)' : '';
    console.log(`  ${label.name} - ${label.color} ${status}`);
  });
} else {
  console.error('Error:', allLabels.error);
}

// Example 2: Filter labels by name
console.log('\n=== Search Labels by Name ===');
const importantLabels = await listLabels(client, {
  name: [{ containsInsensitive: 'important' }],
});

if (importantLabels.success) {
  console.log(`Found ${importantLabels.data.labels.length} labels containing "important"`);
  importantLabels.data.labels.forEach((label) => {
    console.log(`  - ${label.name}: ${label.color}`);
  });
} else {
  console.error('Error:', importantLabels.error);
}

// Example 3: Get specific labels by IDs
console.log('\n=== Get Specific Labels by IDs ===');
const specificLabels = await listLabels(client, {
  id: ['label-id-1', 'label-id-2', 'label-id-3'],
});

if (specificLabels.success) {
  console.log(`Found ${specificLabels.data.labels.length} labels`);
  specificLabels.data.labels.forEach((label) => {
    console.log(`  - ${label.name} (ID: ${label.id})`);
    console.log(`    Color: ${label.color}`);
    console.log(`    Archived: ${label.archived}`);
    console.log(`    Created: ${new Date(label.createdAt).toLocaleDateString()}`);
  });
} else {
  console.error('Error:', specificLabels.error);
}

// Example 4: Get recently created labels (last 30 days)
console.log('\n=== Recently Created Labels ===');
const recentDate = new Date();
recentDate.setDate(recentDate.getDate() - 30);

const recentLabels = await listLabels(client, {
  createdAt: { gte: recentDate.toISOString() },
  limit: 20,
});

if (recentLabels.success) {
  console.log(`Found ${recentLabels.data.labels.length} labels created in the last 30 days`);
  recentLabels.data.labels.forEach((label) => {
    const created = new Date(label.createdAt).toLocaleDateString();
    console.log(`  - ${label.name} (created: ${created})`);
  });
} else {
  console.error('Error:', recentLabels.error);
}

// Example 5: Pagination example
console.log('\n=== Paginated Labels ===');
let offset = 0;
const limit = 10;
let hasMore = true;
let totalLabels = 0;

while (hasMore) {
  const page = await listLabels(client, { limit, offset });

  if (!page.success) {
    console.error('Error:', page.error);
    break;
  }

  totalLabels += page.data.labels.length;
  console.log(`Page ${Math.floor(offset / limit) + 1}: ${page.data.labels.length} labels`);

  if (page.data.nextOffset !== undefined) {
    offset = page.data.nextOffset;
  } else {
    hasMore = false;
  }

  // Safety: stop after 5 pages for demo
  if (offset >= 50) {
    console.log('(stopping after 5 pages for demo)');
    break;
  }
}

console.log(`\nTotal labels fetched: ${totalLabels}`);
