# Budget Bakers Wallet API Wrapper

A TypeScript wrapper for the Budget Bakers Wallet REST API. Built with Effect.ts internally for robust error handling, but exposes a clean Promise-based API for consumers.

## Features

- **Functional API**: Tree-shakable functions that take a client as first parameter
- **Promise-based**: Simple async/await interface
- **Type-safe**: Full TypeScript support
- **Result types**: No exceptions thrown, all errors returned as results
- **Effect.ts powered**: Robust error handling and composability under the hood
- **Pagination support**: Built-in pagination helpers
- **Rate limiting aware**: Handles API rate limits gracefully

## Installation

```bash
bun install
```

## Usage

```typescript
import {
  createClient,
  listAccounts,
  listRecords,
  listCategories
} from './src/index.ts';

// Create a client instance
const client = createClient({
  apiToken: 'your-api-token-here',
});

// List accounts with pagination
const accounts = await listAccounts(client, { limit: 50, offset: 0 });

if (accounts.success) {
  console.log('Accounts:', accounts.data);
  console.log('Has more:', accounts.data.hasMore);
} else {
  console.log('Error:', accounts.error);
}

// List records (transactions)
const records = await listRecords(client, { limit: 20 });

if (records.success) {
  console.log('Records:', records.data);
}

// List categories
const categories = await listCategories(client);

if (categories.success) {
  console.log('Categories:', categories.data);
}
```

## API Organization

The API is organized by resource type:

- **Accounts** (`src/api/accounts.ts`): Account management operations
- **Records** (`src/api/records.ts`): Transaction/entry operations
- **Categories** (`src/api/categories.ts`): Category management operations

Each resource module exports:
- List function with pagination support
- Get by ID function
- Create function
- Update function
- Delete function
- TypeScript types for the resource

## Result Types

All API methods return a `Result<T>` type:

```typescript
type Result<T> =
  | { success: true; data: T }
  | { success: false; error: ApiError }
```

This ensures you always handle both success and error cases explicitly.

## Project Structure

```
src/
├── index.ts          # Main exports
├── client.ts         # Client factory and internal HTTP utilities
├── types.ts          # Shared type definitions
├── errors.ts         # Error types and handling
├── example.ts        # Usage examples
└── api/              # API functions organized by resource
    ├── index.ts      # Barrel exports
    ├── accounts.ts   # Account operations
    ├── records.ts    # Record operations (transactions/entries)
    └── categories.ts # Category operations
```

## Development

Run the example:

```bash
bun run src/example.ts
```

## API Documentation

See [Budget Bakers API Documentation](https://rest.budgetbakers.com/wallet/reference) for available endpoints.

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
