# Gender-Lex Web

Frontend web application for Gender-Lex, a platform for analyzing gender bias in text and documents.

## Overview

This is the TanStack Start web application that provides the user interface for Gender-Lex. It enables users to upload documents, analyze them for gender bias, interact with an AI chatbot, and manage analysis presets and AI models. The application supports internationalization with English and Spanish languages.

## Features

- **Document Upload & Analysis**: Upload PDFs or paste text for gender bias analysis
- **Real-time Analysis**: Stream analysis results as they're generated
- **Floating AI Chatbot**: Always-accessible AI assistant with advanced features
  - **Fixed Position Widget**: Beautiful floating button accessible from any page
  - **Smooth Animations**: Modern UI with slide-in/fade effects and hover animations
  - **AI-Powered Responses**: Integrated with Gemini AI (gemini-2.5-flash) via TanStack AI
  - **Real-time Streaming**: Server-Sent Events (SSE) for live response streaming
  - **Conversation Management**: Persistent chat history across sessions
  - **Interactive Features**: Copy responses, retry failed messages, auto-scroll
  - **Context-Aware Help**: Get guidance on models, presets, analysis, and platform features
  - **Bilingual Support**: Interface in Spanish with natural language understanding
  - **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Model Management**: Configure and test AI models
- **Preset Management**: Create and manage analysis presets
- **User Profiles**: User authentication and profile management
- **Multi-language Support**: English and Spanish interfaces (Lingui i18n)
- **Dark/Light Themes**: Theme switching with persistent preferences
- **Responsive Design**: Mobile-first responsive design
- **Anonymous Access**: Start analyzing without creating an account

## Tech Stack

- **Framework**: TanStack Start (file-based routing)
- **Build Tool**: Vinxi + Vite
- **React**: React 19
- **Router**: TanStack Router
- **UI Components**: Radix UI, shadcn/ui
- **Styling**: Tailwind CSS 4, Tailwind Animate
- **Forms**: React Hook Form + Zod validation
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Authentication**: Better Auth (via @repo/auth)
- **Database**: PostgreSQL via @repo/db
- **API Client**: Elysia Eden (type-safe API client)
- **Internationalization**: Lingui
- **Animations**: Framer Motion (motion)
- **Theme**: next-themes
- **Icons**: Lucide React
- **Real-time**: Server-Sent Events (reconnecting-eventsource)
- **Functional Programming**: Effect
- **Type Safety**: TypeScript

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── [locale]/          # Internationalized routes
│   │   ├── (domain)/      # Main application routes
│   │   │   ├── analysis/  # Analysis pages
│   │   │   ├── models/    # Model configuration
│   │   │   ├── presets/   # Preset management
│   │   │   ├── profile/   # User profile
│   │   │   └── page.tsx   # Home page
│   │   ├── (security)/    # Auth pages (login, register)
│   │   └── layout.tsx     # Locale layout
│   └── api/               # API routes (auth callbacks)
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── rhf/              # React Hook Form components
│   └── theme/            # Theme components
├── lib/                  # Utilities and configurations
│   ├── actions/         # Server actions
│   ├── api/             # API client setup
│   └── utils.ts         # Utility functions
├── locales/             # i18n translations
│   ├── components/      # Language switcher
│   └── messages/        # Translation files
└── styles/              # Global styles
```

## Main Features

### Analysis Page
- Upload multiple PDFs or paste text
- Select analysis presets
- View real-time analysis progress
- Download analysis reports
- View bias detection results with suggestions

### Floating AI Chatbot
- **Modern Floating Widget**
  - Fixed position at bottom-right corner
  - Animated open/close transitions
  - Beautiful gradient effects on hover
  - Always accessible from any page
- **AI-Powered Conversations**
  - Gemini AI integration (gemini-2.5-flash model)
  - Real-time streaming responses via SSE
  - Natural language understanding
  - Context-aware about platform features
- **Interactive Features**
  - Copy message content to clipboard
  - Retry failed or incorrect responses
  - Auto-scroll to latest messages
  - Message history persistence
  - Loading indicators during streaming
- **User Experience**
  - Smooth slide-in/fade animations
  - Responsive design (mobile and desktop)
  - Clean, modern chat interface
  - Bilingual support (Spanish/English)
  - Accessible keyboard navigation

### Chatbot
- AI-powered assistant (legacy)
- Context-aware responses
- Conversation history
- Gender-inclusive language suggestions

**Note**: The main chatbot feature is now the Floating AI Chatbot widget (see above), which provides a more modern and accessible experience.

### Model Management
- Configure AI models (OpenAI-compatible)
- Test model configurations
- Manage API keys securely
- Model preset system

### Preset Management
- Create custom analysis presets
- Configure analysis parameters
- Share presets with team
- Default preset selection

### User Profile
- Account management
- Change password
- Language preferences
- Analysis history

## Getting Started

### Prerequisites

- Node.js 24.x
- Bun 1.3.2 (package manager)
- PostgreSQL database

### Environment Variables

Create a `.env.local` file in the apps/web directory:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/genderlex

# API URL
NEXT_PUBLIC_API_URL=http://localhost:3000

# Authentication (Better Auth)
BETTER_AUTH_SECRET=your_secret_key
BETTER_AUTH_URL=http://localhost:4000
AUTH_GOOGLE_ID=your_google_client_id
AUTH_GOOGLE_SECRET=your_google_secret
AUTH_GITHUB_ID=your_github_client_id
AUTH_GITHUB_SECRET=your_github_secret

# AI Chatbot (Required for Floating Chatbot Widget)
GEMINI_API_KEY=your_gemini_api_key

# Public URL
NEXT_PUBLIC_URL=http://localhost:4000
```

### Installation

```bash
# Install dependencies (run from monorepo root)
bun install

# Generate database schema
bun run generate

# Run database migrations
bun run migrate

# Generate locale messages
cd apps/web
bun run locales:gen
```

### Development

```bash
# Start development server (from monorepo root)
bun run dev

# Or start only web (from monorepo root)
cd apps/web
bun run dev
```

The web app will be available at http://localhost:4000

### Building

```bash
# Build for production (from monorepo root)
bun run build

# Or build only web
bun run build:web
```

### Production

```bash
# Start production server
bun run start

# Or use monorepo script
bun run prod:web
```

## Internationalization

The application supports multiple languages using Lingui:

### Supported Languages

- English (en)
- Spanish (es) - Default

### Adding Translations

1. Add translation keys in your components using Lingui macros:

```tsx
import { Trans, msg } from '@lingui/react/macro'

function Component() {
  return <Trans>Hello World</Trans>
}
```

2. Extract messages:

```bash
bun run locales:gen
```

3. Translate in `src/locales/messages/{locale}/messages.po`

4. Compile (automatic in dev/build)

## Styling

The application uses Tailwind CSS 4 with:

- **shadcn/ui**: Pre-built accessible components
- **Radix UI**: Unstyled, accessible component primitives
- **CVA**: Class Variance Authority for component variants
- **tailwind-merge**: Merge Tailwind classes intelligently
- **tw-animate-css**: Additional animation utilities

### Theme

The app supports light and dark themes with smooth transitions:

- System default detection
- Manual theme toggle
- Persistent preference storage
- Theme-aware components

## State Management

- **Zustand**: Global client state
- **React Query**: Server state management
- **React Hook Form**: Form state
- **nuqs**: URL state management

## API Integration

The app uses Elysia Eden for type-safe API calls:

```typescript
import { api } from '@/lib/api/client'

// Fully typed API calls
const analysis = await api.analysis.prepare.post({
  files: [file],
  selectedPreset: presetId
})
```

## Authentication Flow

1. Anonymous users can access the app and perform analyses
2. Users can sign up/sign in via email or OAuth (Google, GitHub)
3. Anonymous data is automatically migrated to the user account
4. Session management handled by Better Auth

## Testing

```bash
# Run tests (from monorepo root)
bun run test

# Run E2E tests
bun run test:e2e
```

## Linting & Formatting

```bash
# Lint code
bun run lint

# Format code
bun run format
```

## Scripts

- `dev` - Start development server on port 4000
- `build` - Build for production
- `start` - Start production server
- `lint` - Lint code with oxlint
- `generate` - Generate workflow code
- `locales:gen` - Extract translation messages
- `type:gen` - Generate Next.js types
- `studio` - Open workflow studio

## Performance Optimizations

- **React Compiler**: Automatic component memoization
- **Next.js Image**: Optimized image loading
- **Code Splitting**: Automatic route-based splitting
- **Incremental Static Regeneration**: For static content
- **Server Components**: Reduced client-side JavaScript

## Accessibility

- **Radix UI**: Built with accessibility in mind
- **Keyboard Navigation**: Full keyboard support
- **ARIA Labels**: Proper ARIA attributes
- **Focus Management**: Logical focus flow
- **Screen Reader Support**: Semantic HTML

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Related Packages

- `@repo/auth` - Authentication configuration
- `@repo/db` - Database models and client
- `@repo/types` - Shared TypeScript types
- `api` - Backend API server
