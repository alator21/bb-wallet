# Budget Bakers Wallet API Wrapper

A TypeScript wrapper for the Budget Bakers Wallet REST API. Built with Effect.ts internally for robust error handling, but exposes a clean Promise-based API for consumers.

> **Work In Progress**: This library currently supports the Accounts API. More endpoints (records, categories, budgets, etc.) will be added in future releases.

## Features

- **Functional API**: Tree-shakable functions that take a client as first parameter
- **Promise-based**: Simple async/await interface
- **Type-safe**: Full TypeScript support with comprehensive types
- **Result types**: No exceptions thrown, all errors returned as results
- **Effect.ts powered**: Robust error handling and composability under the hood
- **Advanced filtering**: Text filters (contains, starts/ends with) and range filters for precise queries
- **Response metadata**: Access rate limit info, sync status, and data revision tracking
- **Rate limiting aware**: Handles API rate limits gracefully

## Installation

```bash
# JSR (recommended)
bunx jsr add @alator21/bb-wallet

# or with Deno
deno add @alator21/bb-wallet

# or with npm
npx jsr add @alator21/bb-wallet
```

## Usage

```typescript
import { createClient, listAccounts } from '@alator21/bb-wallet';

// Create a client instance
const client = createClient({
  apiToken: 'your-api-token-here',
});

// List accounts with pagination
const result = await listAccounts(client, { limit: 50, offset: 0 });

if (result.success) {
  console.log('Accounts:', result.data.accounts);
  console.log('Next offset:', result.data.nextOffset);

  // Access metadata from response headers
  console.log('Rate limit remaining:', result.metadata.rateLimitRemaining);
  console.log('Last data change:', result.metadata.lastDataChangeAt);
} else {
  console.error('Error:', result.error);
}
```

### Advanced Filtering

The library supports powerful filtering capabilities:

```typescript
// Filter accounts by name, type, and date range
const filtered = await listAccounts(client, {
  name: [{ containsInsensitive: 'savings' }],
  accountType: 'SavingAccount',
  currencyCode: 'USD',
  createdAt: {
    gte: '2024-01-01',  // greater than or equal
    lt: '2024-12-31'     // less than
  },
  agentHints: true  // Enable AI agent hints
});

// Text filters support multiple operators
const nameFilters = await listAccounts(client, {
  name: [
    { startsWithInsensitive: 'bank' },
    { endsWithInsensitive: 'account' }
  ]
});

// Filter by multiple IDs (max 30)
const specific = await listAccounts(client, {
  id: ['acc-123', 'acc-456', 'acc-789']
});
```

## Currently Supported APIs

### Accounts (`src/api/accounts.ts`)

- **`listAccounts`**: List accounts with advanced filtering and pagination

**Account Types Supported:**
- `General`, `Cash`, `CurrentAccount`, `CreditCard`, `SavingAccount`
- `Bonus`, `Insurance`, `Investment`, `Loan`, `Mortgage`, `Overdraft`

**Filters Available:**
- `id`: Filter by account IDs (max 30)
- `name`: Text filter (contains, starts/ends with, case-insensitive)
- `bankAccountNumber`: Text filter
- `accountType`: Filter by account type
- `currencyCode`: ISO 4217 currency code
- `createdAt`, `updatedAt`: Date range filters (gte, gt, lte, lt)
- `agentHints`: Enable AI agent hints in response

**Coming Soon:** Get by ID, create, update, and delete operations

## Result Types

All API methods return a `Result<T>` type:

```typescript
type Success<T> = {
  success: true;
  data: T;
  metadata: ResponseMetadata;  // Rate limits, sync status, etc.
};

type Failure = {
  success: false;
  error: ApiError;
};

type Result<T> = Success<T> | Failure;
```

This ensures you always handle both success and error cases explicitly. Success responses include metadata from API headers (rate limits, data revision tracking, sync status).

## Project Structure

```
src/
├── index.ts               # Main exports
├── client.ts              # Client factory and HTTP request utilities
├── types.ts               # Shared type definitions and Result types
├── errors.ts              # Error types and handling
├── utils/
│   ├── filters.ts         # Text and range filter types
│   └── query-builder.ts   # Query parameter builder utility
└── api/
    ├── index.ts           # API barrel exports
    └── accounts.ts        # Accounts API (list, types, filters)

examples/
└── basic-usage.ts         # Usage examples
```

## Development

```bash
# Run the example
bun run dev

# Run tests
bun test

# Type checking
bun run typecheck
```

## Roadmap

The following endpoints are planned for future releases:

- **Records API**: Create, read, update, delete transactions/entries
- **Categories API**: Manage transaction categories
- **Budgets API**: Budget management and tracking
- **Labels API**: Custom labels and tags
- **Currencies API**: Currency information and exchange rates

Contributions are welcome! See the [Budget Bakers API Documentation](https://rest.budgetbakers.com/wallet/reference) for the full API reference.

## Response Metadata

All successful responses include metadata extracted from API headers:

```typescript
interface ResponseMetadata {
  lastDataChangeAt?: string;      // ISO 8601 timestamp of last data change
  lastDataChangeRev?: string;     // Revision counter for change detection
  rateLimitLimit?: number;        // Maximum requests per hour
  rateLimitRemaining?: number;    // Remaining requests in current window
  syncInProgress?: boolean;       // True if background sync is running
}
```

This allows you to:
- Track rate limit usage and avoid hitting limits
- Detect when data has changed between requests
- Know when the API is performing background syncs

## Architecture

**Functional Design**: API functions take a client instance as their first parameter, making them:
- Tree-shakable (only bundle what you use)
- Composable and testable
- Easy to wrap or extend

**Effect.ts Powered**: Uses Effect.ts internally for:
- Composable error handling
- Type-safe effects
- Robust async operations

But exposes a simple Promise-based API so consumers don't need to know about Effect.ts.

## Publishing

This package is published to [JSR (JavaScript Registry)](https://jsr.io/@alator21/bb-wallet) for modern JavaScript runtimes.

**Benefits of JSR:**
- Native TypeScript support (no build step needed)
- Works with Deno, Node.js, Bun, and browsers
- Automatic documentation generation
- Better dependency management

## License

MIT
