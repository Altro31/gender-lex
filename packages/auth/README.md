# @repo/auth

Authentication package for Gender-Lex using Better Auth.

## Overview

This package provides authentication functionality for the Gender-Lex monorepo. It integrates Better Auth with ZenStack for database operations and supports multiple authentication methods including email/password and OAuth providers (Google, GitHub).

## Features

- **Email/Password Authentication**: Traditional email and password-based authentication
- **OAuth Integration**: Support for Google and GitHub OAuth providers
- **Anonymous Sessions**: Allow users to start using the app anonymously and link accounts later
- **Custom Session Fields**: Extended session with language preferences
- **ZenStack Integration**: Seamless integration with the database layer using ZenStack adapter

## Exports

The package exports three main modules:

- `@repo/auth/api` - Server-side authentication configuration and Better Auth instance
- `@repo/auth/next` - Next.js client-side authentication utilities
- `@repo/auth/encrypt` - Encryption utilities for secure data handling

## Usage

### Server-side (API)

```typescript
import { auth } from '@repo/auth/api'

// The auth instance is already configured with database adapter,
// OAuth providers, and custom session handling
app.mount(auth.handler)
```

### Client-side (Next.js)

```typescript
import { client } from '@repo/auth/next'

// Use the client in your Next.js components
const session = await client.getSession()
```

## Configuration

The following environment variables are required:

- `UI_URL` - The URL of the web application
- `AUTH_GOOGLE_ID` - Google OAuth client ID
- `AUTH_GOOGLE_SECRET` - Google OAuth client secret
- `AUTH_GITHUB_ID` - GitHub OAuth client ID
- `AUTH_GITHUB_SECRET` - GitHub OAuth client secret
- `DATABASE_URL` - PostgreSQL connection string (inherited from @repo/db)

## Dependencies

- `better-auth` - Core authentication library
- `@zenstackhq/better-auth` - ZenStack adapter for Better Auth
- `@repo/db` - Database package for data access

## Features in Detail

### Anonymous Authentication

Users can start using the application without creating an account. When they decide to register or sign in, their anonymous data (analyses) is automatically migrated to their new account.

### Custom Session

Sessions include an additional `lang` field to store the user's preferred language, defaulting to 'es' (Spanish).

### Account Linking

The package handles automatic migration of user data when anonymous users link their account to a registered account through email or OAuth providers.
