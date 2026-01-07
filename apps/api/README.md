# Gender-Lex API

Backend API for Gender-Lex, a platform for analyzing gender bias in text and documents.

## Overview

This is the REST API server built with Elysia and Bun. It provides endpoints for document analysis, AI-powered gender bias detection, terminology extraction, and chatbot interactions. The API uses Effect for functional programming patterns and integrates with PostgreSQL for data persistence.

## Features

- **Document Analysis**: Upload and analyze documents (PDF, text) for gender bias
- **AI Integration**: Powered by AI models for intelligent bias detection and suggestions
- **Gender Terminology Detection**: Identify gendered language and suggest alternatives
- **Workflow Engine**: Step-by-step analysis pipeline using Workflow
- **Real-time Updates**: Server-Sent Events (SSE) for streaming analysis progress
- **AI Chatbot API**: Conversational assistant powered by Gemini AI
  - Message sending and retrieval endpoints
  - Conversation history management with database persistence
  - AI-generated context-aware responses using Gemini 1.5 Flash
  - Specialized knowledge about Gender-Lex platform features
  - Support for models, presets, analysis, and inclusive language suggestions
- **Authentication**: Integrated with Better Auth for secure access
- **Model Management**: Configure and manage AI models and analysis presets
- **OpenAPI Documentation**: Auto-generated API documentation at `/swagger`

## Tech Stack

- **Runtime**: Bun
- **Framework**: Elysia
- **Build Tool**: Nitro
- **Functional Programming**: Effect
- **Database**: PostgreSQL via @repo/db (Prisma + ZenStack)
- **Authentication**: Better Auth via @repo/auth
- **AI/LLM**: AI SDK, OpenAI-compatible providers
- **PDF Processing**: Adobe PDF Services
- **Medical Terminology**: UMLS.js integration
- **API Documentation**: Elysia OpenAPI plugin

## Project Structure

```
src/
├── index.ts              # Main application entry point
├── modules/              # Feature modules
│   ├── analysis/        # Document analysis endpoints
│   ├── chatbot/         # AI chatbot functionality
│   ├── model/           # Model configuration
│   ├── preset/          # Analysis presets
│   ├── ai/              # AI integration
│   ├── bias-detection/  # Gender bias detection
│   ├── terminology/     # Medical terminology extraction
│   ├── extractor/       # Content extraction utilities
│   ├── user/            # User management
│   ├── sse/             # Server-Sent Events
│   └── zen/             # ZenStack integration
├── workflows/           # Workflow definitions
│   └── analice/        # Analysis workflow steps
├── lib/                 # Shared libraries
│   ├── types/          # Type definitions
│   ├── file.ts         # File handling utilities
│   └── pagination.ts   # Pagination helpers
└── plugins/             # Elysia plugins
    ├── auth.plugin.ts  # Authentication middleware
    └── effect.plugin.ts # Effect integration
```

## API Modules

### Analysis (`/analysis`)
- Upload documents (PDF, text) for gender bias analysis
- Prepare and start analysis workflows
- Retrieve analysis results and status
- Cancel ongoing analyses

### Chatbot (`/chatbot`)
- **POST `/chatbot/message`** - Send a message and receive bot response
  - Input: `{ content: string }` - The user's message
  - Output: `{ userMessage, botMessage }` - Both messages with IDs and timestamps
  - Creates or retrieves existing conversation for the user
  - Saves both user and bot messages to database
  - Uses Gemini AI to generate intelligent, context-aware responses
- **GET `/chatbot/messages`** - Retrieve conversation history
  - Returns all messages from user's conversation
  - Messages ordered chronologically (oldest first)
  - Includes sender type (user/bot) and timestamps

**Chatbot Features**:
- Automatic conversation management per user
- AI-powered intelligent responses using Gemini 1.5 Flash
- Conversation history context (last 10 messages)
- Specialized knowledge about Gender-Lex platform:
  - Models and LLM configuration
  - Analysis presets and combinations
  - Gender bias analysis features
  - Platform navigation and help
  - Inclusive language suggestions
- Bilingual support (Spanish primary, with English understanding)
- Message persistence in database

### Models (`/models`)
- Configure AI models for analysis
- Manage model presets
- Test model configurations

### Presets (`/presets`)
- Create and manage analysis presets
- Define analysis parameters and rules
- Share presets across team

### AI Integration
- OpenAI-compatible provider support
- Streaming responses
- Context-aware prompts

### Terminology
- Extract medical terminology from text
- UMLS integration for medical concepts
- Gender-specific term identification

## Getting Started

### Prerequisites

- Bun 1.3.2 or higher
- PostgreSQL database
- Node.js 24.x (for compatibility)

### Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/genderlex

# Authentication (from @repo/auth)
UI_URL=http://localhost:4000
AUTH_GOOGLE_ID=your_google_client_id
AUTH_GOOGLE_SECRET=your_google_secret
AUTH_GITHUB_ID=your_github_client_id
AUTH_GITHUB_SECRET=your_github_secret

# AI/LLM Configuration
GROQ_API_KEY=your_groq_api_key
GEMINI_API_KEY=your_gemini_api_key

# Adobe PDF Services (for PDF processing)
PDF_SERVICES_CLIENT_ID=your_adobe_client_id
PDF_SERVICES_CLIENT_SECRET=your_adobe_client_secret

# UMLS API (for medical terminology)
UMLS_API_KEY=your_umls_api_key
UMLS_API_URL=https://uts-ws.nlm.nih.gov

# Encryption
ENCRYPTION_KEY=your_32_character_encryption_key
```

### Installation

```bash
# Install dependencies (run from monorepo root)
bun install

# Generate database schema
bun run generate

# Run database migrations
bun run migrate
```

### Development

```bash
# Start development server with hot reload
bun run dev
```

The API will be available at http://localhost:3000

### Building

```bash
# Build for production
bun run build

# Build only the API
bun run build:api
```

### Production

```bash
# Start production server
bun run start

# Or use the monorepo script
bun run prod:api
```

## API Documentation

Once the server is running, you can access:

- **OpenAPI/Swagger UI**: http://localhost:3000/swagger
- **Health Check**: http://localhost:3000/ (returns `{ ok: true }`)

## Workflows

The API uses the Workflow engine for complex, multi-step operations. The main workflow is:

### Analysis Workflow (`workflows/analice/`)

1. **Pre-analysis**: Validate input and prepare data
2. **Extract Content**: Extract text from PDFs or process text input
3. **Detect Bias**: Analyze text for gender bias
4. **Generate Report**: Create comprehensive analysis report
5. **Store Results**: Save analysis to database

## Plugins

### Authentication Plugin (`auth.plugin.ts`)

Protects routes with authentication middleware. Provides user context to endpoints.

### Effect Plugin (`effect.plugin.ts`)

Integrates Effect runtime with Elysia, enabling functional error handling and dependency injection.

## Testing

Testing infrastructure is not yet implemented.

## Linting

```bash
# Lint and fix code
bun run lint
```

## Architecture Patterns

- **Effect-TS**: Functional programming with composable effects
- **Dependency Injection**: Services injected via Effect layers
- **Type Safety**: End-to-end type safety with Elysia and Effect
- **Modularity**: Feature-based module organization
- **Real-time Communication**: SSE for streaming updates

## Related Packages

- `@repo/auth` - Authentication configuration
- `@repo/db` - Database models and client
- `@repo/types` - Shared TypeScript types
