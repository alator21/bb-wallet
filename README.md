# Budget Bakers Wallet API Wrapper

A TypeScript wrapper for the Budget Bakers Wallet REST API. Built with Effect.ts internally for robust error handling, but exposes a clean Promise-based API for consumers.

## Features

- **Promise-based API**: Simple async/await interface
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
import BudgetBakersWallet from './src/index.ts';

// Initialize the client
const client = new BudgetBakersWallet({
  apiToken: 'your-api-token-here',
});

// All methods return Result types - never throw exceptions
const result = await client.getUser();

if (result.success) {
  console.log('User:', result.data);
} else {
  console.log('Error:', result.error);
}
```

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
├── index.ts      # Main API wrapper class
├── client.ts     # Internal HTTP client (Effect-based)
├── types.ts      # Type definitions
├── errors.ts     # Error types and handling
└── example.ts    # Usage examples
```

## Development

Run the example:

```bash
bun run src/example.ts
```

## API Documentation

See [Budget Bakers API Documentation](https://rest.budgetbakers.com/wallet/reference) for available endpoints.

## Architecture

This wrapper uses Effect.ts internally for:
- Composable error handling
- Type-safe effects
- Robust async operations

But exposes a simple Promise-based API so consumers don't need to know about Effect.ts.
