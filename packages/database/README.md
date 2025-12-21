# @repo/db

Database package for Gender-Lex using ZenStack and Prisma.

## Overview

This package manages the database schema, migrations, and provides type-safe database clients for the Gender-Lex application. It uses ZenStack for enhanced schema modeling with built-in access control policies and Prisma as the underlying ORM.

## Features

- **ZenStack Schema**: Enhanced schema modeling with access control policies
- **Type-Safe Client**: Fully typed database client with Effect integration
- **Access Control**: Built-in policy-based access control at the database level
- **PostgreSQL**: Production-ready PostgreSQL database support
- **Migrations**: Database migration management with Prisma
- **Studio**: Visual database browser using Prisma Studio

## Schema Models

The database includes the following main models:

- `User` - User accounts and profiles
- `Session` - Authentication sessions
- `Analysis` - Gender bias analysis records
- `Model` - AI model configurations
- `PresetModel` - Model presets for different analysis types
- `Preset` - Analysis configuration presets
- `Chatbot` - Chatbot conversation data

## Exports

The package provides multiple export paths:

- `@repo/db/input` - Generated input types for database operations
- `@repo/db/models` - Generated model types
- `@repo/db/client` - Standard Prisma client instance
- `@repo/db/effect` - Effect-based database client with functional programming support
- `@repo/db/schema/*` - Individual schema model definitions

## Usage

### Basic Client Usage

```typescript
import { client } from '@repo/db/client'

// Use the standard Prisma client
const user = await client.user.findUnique({
  where: { id: userId }
})
```

### Effect-Based Client

```typescript
import { db } from '@repo/db/effect'
import { Effect } from 'effect'

// Use Effect for functional, composable database operations
const program = Effect.gen(function* () {
  const database = yield* db
  return yield* database.user.findUnique({
    where: { id: userId }
  })
})
```

### With Type-Safe Inputs

```typescript
import type { UserCreateInput } from '@repo/db/input'

const newUser: UserCreateInput = {
  email: 'user@example.com',
  name: 'John Doe'
}
```

## Scripts

### Development

```bash
# Generate Prisma client and ZenStack artifacts
bun run generate

# Create a new migration
bun run migrate

# Open Prisma Studio for visual database management
bun run studio
```

### Production

```bash
# Apply migrations in production
bun run migrate:prod
```

## Configuration

### Environment Variables

- `DATABASE_URL` - PostgreSQL connection string (required)
  ```
  postgresql://user:password@host:port/database
  ```

### Schema Location

The main schema file is located at `schema.zmodel` and imports models from `src/schema/`:
- `src/schema/user.zmodel` - User and authentication models
- `src/schema/chatbot.zmodel` - Chatbot related models

## ZenStack Policy Plugin

The package uses the `@zenstackhq/plugin-policy` to generate access control policies at compile time, ensuring that data access rules are enforced at the database query level.

## Dependencies

- `@zenstackhq/orm` - ZenStack ORM layer
- `@zenstackhq/plugin-policy` - Policy-based access control
- `@zenstackhq/server` - Server-side utilities
- `pg` - PostgreSQL driver
- `effect` - Functional programming utilities

## Development Dependencies

- `@zenstackhq/cli` - ZenStack CLI tools for code generation
- `@types/pg` - TypeScript definitions for PostgreSQL
- `type-fest` - Utility types for TypeScript
