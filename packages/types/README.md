# @repo/types

Shared TypeScript types for Gender-Lex.

## Overview

This package provides shared TypeScript type definitions used across the Gender-Lex monorepo. It serves as a central location for common types that are used by multiple applications and packages.

## Purpose

The types package exists to:

- **Centralize Common Types**: Avoid duplication of type definitions across the monorepo
- **Type Safety**: Ensure type consistency between API and web applications
- **Shared Interfaces**: Define contracts between different parts of the application
- **API Types**: Export types for API responses, SSE events, and utilities

## Exports

The package exports several type modules:

- `@repo/types/api` - API-related types including analysis, models, and responses
- `@repo/types/sse` - Server-Sent Events (SSE) type definitions
- `@repo/types/utils` - Utility types for common operations

## Usage

### In Applications

```typescript
// Import API types in web application
import type { AnalysisResponse, ModelConfig } from '@repo/types/api'

// Import SSE event types
import type { AnalysisEvent } from '@repo/types/sse'

// Import utility types
import type { Pagination, AsyncResult } from '@repo/types/utils'
```

### In Packages

```typescript
// Use shared types in other packages
import type { ApiResponse } from '@repo/types/api'

function handleResponse(response: ApiResponse) {
  // Type-safe response handling
}
```

## Type Categories

### API Types (`api.ts`)

Contains types for API requests, responses, and data models used in communication between the API and web applications.

### SSE Types (`sse.ts`)

Defines types for Server-Sent Events used in real-time communication, particularly for streaming analysis results and AI responses.

### Utility Types (`utils.ts`)

Common utility types for pagination, error handling, async operations, and other shared functionality.

## Peer Dependencies

This package has peer dependencies on:

- `@repo/db` - For database model types
- `api` - For API endpoint types

This structure ensures that types stay in sync with the actual implementations while avoiding circular dependencies.

## Development

Since this package only contains TypeScript type definitions, there are no build or runtime dependencies. Types are resolved at compile time by the TypeScript compiler.

## Best Practices

When adding new types to this package:

1. **Keep it Generic**: Only add types that are used by multiple packages
2. **No Implementation**: This package should only contain type definitions, no runtime code
3. **Logical Grouping**: Organize types by feature or domain
4. **Clear Naming**: Use descriptive names that indicate the type's purpose
5. **Documentation**: Add JSDoc comments for complex types
