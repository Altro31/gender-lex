# Gender-Lex

![Cron job status](https://api.cron-job.org/jobs/6338465/4b2facbd69e67d1c/status-7.svg)

A comprehensive platform for analyzing gender bias in text and documents, powered by AI. Gender-Lex helps writers, organizations, and researchers identify gendered language and provides suggestions for more inclusive alternatives.

## 🎯 Overview

Gender-Lex is a full-stack TypeScript monorepo that provides:

- **Automated Gender Bias Analysis**: Upload documents or paste text to detect gender bias
- **AI-Powered Suggestions**: Get intelligent recommendations for gender-inclusive language
- **Medical Terminology Support**: Specialized analysis for medical and scientific texts using UMLS
- **Real-time Analysis**: Stream analysis results as they're generated
- **Floating AI Chatbot**: Always-accessible AI assistant for instant help with gender-inclusive writing
  - Modern floating widget with smooth animations
  - Context-aware responses powered by Gemini AI
  - Streaming responses for real-time interaction
  - Conversation history management
  - Copy and retry message features
- **Customizable Presets**: Create and manage analysis configurations for different use cases
- **Multi-language Support**: Interface available in English and Spanish

## 🏗️ Architecture

This is a Turborepo monorepo with the following structure:

```
gender-lex/
├── apps/
│   ├── api/              # Backend API (Elysia + Bun)
│   └── web/              # Frontend web app (Next.js 16)
└── packages/
    ├── auth/             # Authentication (@repo/auth)
    ├── database/         # Database & schema (@repo/db)
    └── types/            # Shared TypeScript types (@repo/types)
```

### Applications

#### 🔧 API (`apps/api`)

RESTful API server built with:
- **Runtime**: Bun
- **Framework**: Elysia
- **Database**: PostgreSQL (Prisma + ZenStack)
- **Auth**: Better Auth
- **AI**: OpenAI-compatible providers
- **Workflow**: Custom workflow engine for analysis pipelines
- **Real-time**: Server-Sent Events (SSE)

**Key Features**:
- Document upload and processing (PDF, text)
- Multi-step analysis workflows
- AI model management
- Preset configuration
- Medical terminology extraction via UMLS
- AI Chatbot API with conversation management
  - Message sending and retrieval endpoints
  - Conversation history persistence
  - Context-aware bot responses

📚 [API Documentation](./apps/api/README.md)

#### 🎨 Web (`apps/web`)

Modern web application built with:
- **Framework**: Next.js 16 (App Router)
- **UI**: React 19 + Radix UI + shadcn/ui
- **Styling**: Tailwind CSS 4
- **i18n**: Lingui (English/Spanish)
- **State**: TanStack Query + Zustand
- **Type Safety**: Full end-to-end type safety with Elysia Eden

**Key Features**:
- Document upload interface
- Real-time analysis visualization
- Floating AI Chatbot Widget
  - Fixed position chatbot accessible from any page
  - Smooth animations and modern UI design
  - Real-time streaming responses via Server-Sent Events
  - Message history with copy and retry actions
  - Powered by Gemini AI (gemini-2.5-flash)
- Model and preset management
- User authentication and profiles
- Dark/light theme support
- Mobile-responsive design

📚 [Web Documentation](./apps/web/README.md)

### Packages

#### 🔐 Auth (`packages/auth`)

Authentication package using Better Auth with:
- Email/password authentication
- OAuth (Google, GitHub)
- Anonymous sessions with account linking
- Custom session fields (language preferences)
- ZenStack integration

📚 [Auth Documentation](./packages/auth/README.md)

#### 💾 Database (`packages/database`)

Database layer with:
- ZenStack schema with access control policies
- Prisma ORM
- PostgreSQL support
- Effect-based client
- Type-safe operations
- Migration management

**Models**: User, Session, Analysis, Model, Preset, Chatbot

📚 [Database Documentation](./packages/database/README.md)

#### 📝 Types (`packages/types`)

Shared TypeScript types for:
- API contracts
- SSE events
- Common utilities
- Cross-package type safety

📚 [Types Documentation](./packages/types/README.md)

## 🚀 Getting Started

### Prerequisites

- **Bun**: 1.3.2 or higher
- **Node.js**: 24.x (for compatibility)
- **PostgreSQL**: 14 or higher
- **API Keys**:
  - OpenAI API key (or compatible provider)
  - **Gemini API key** (required for Floating AI Chatbot)
  - Optional: Google OAuth, GitHub OAuth
  - Optional: Adobe PDF Services (for PDF processing)
  - Optional: UMLS API key (for medical terminology)

### Installation

1. **Clone the repository**:

```bash
git clone https://github.com/whojas/gender-lex.git
cd gender-lex
```

2. **Install dependencies**:

```bash
bun install
```

3. **Set up environment variables**:

Copy the example env files and fill in your values:

```bash
# Database configuration (root level)
cp packages/database/.env.example packages/database/.env

# Web app configuration
cp apps/web/.env.example apps/web/.env.local
```

Edit the `.env` files with your configuration:

```env
# packages/database/.env
DATABASE_URL=postgresql://user:password@localhost:5432/genderlex

# apps/web/.env.local
DATABASE_URL=postgresql://user:password@localhost:5432/genderlex
NEXT_PUBLIC_API_URL=http://localhost:3000
BETTER_AUTH_SECRET=your_secret_key
AUTH_GOOGLE_ID=your_google_client_id
AUTH_GOOGLE_SECRET=your_google_secret
# ... (see apps/web/.env.example for all options)
```

4. **Set up the database**:

```bash
# Generate Prisma client and ZenStack code
bun run generate

# Run migrations
bun run migrate
```

5. **Start development servers**:

```bash
# Start all apps in development mode
bun run dev
```

This will start:
- API server at http://localhost:3000
- Web app at http://localhost:4000

### Building for Production

```bash
# Build all apps
bun run build

# Or build individually
bun run build:api    # Build API only
bun run build:web    # Build web only
```

### Running in Production

```bash
# Run migrations in production
bun run migrate:prod

# Start API server
bun run prod:api

# Start web server (in another terminal)
bun run prod:web
```

## 📦 Scripts

The root `package.json` provides these scripts:

### Development
- `dev` - Start all apps in development mode with hot reload
- `generate` - Generate Prisma client and ZenStack code
- `migrate` - Run database migrations (development)
- `migrate:prod` - Run database migrations (production)

### Building
- `build` - Build all apps and packages
- `build:api` - Build API only
- `build:web` - Build web only

### Production
- `prod:api` - Start API in production mode
- `prod:web` - Start web in production mode

### Quality
- `test` - Run all tests
- `test:e2e` - Run end-to-end tests
- `lint` - Lint all code
- `format` - Format code with Prettier

## 🛠️ Tech Stack

### Core Technologies
- **Language**: TypeScript
- **Package Manager**: Bun
- **Monorepo**: Turborepo
- **Database**: PostgreSQL
- **ORM**: Prisma + ZenStack
- **Authentication**: Better Auth

### Backend
- **Runtime**: Bun
- **Framework**: Elysia
- **Build Tool**: Nitro
- **FP Library**: Effect
- **Validation**: Zod
- **AI/LLM**: AI SDK
- **PDF**: Adobe PDF Services
- **Medical Terms**: UMLS.js

### Frontend
- **Framework**: Next.js 16
- **UI Library**: React 19
- **Components**: Radix UI + shadcn/ui
- **Styling**: Tailwind CSS 4
- **i18n**: Lingui
- **State**: TanStack Query + Zustand
- **Forms**: React Hook Form
- **Animation**: Framer Motion
- **Icons**: Lucide React

### Development Tools
- **Linting**: oxlint
- **Formatting**: Prettier
- **Type Checking**: TypeScript
- **Git Hooks**: Husky
- **Staged Files**: lint-staged

## 🏃 Development Workflow

### Adding a New Feature

1. **Create feature branch**:
```bash
git checkout -b feature/your-feature-name
```

2. **Make changes** in the relevant app or package

3. **Test your changes**:
```bash
bun run test
bun run lint
```

4. **Build to ensure no errors**:
```bash
bun run build
```

5. **Commit and push**:
```bash
git add .
git commit -m "feat: your feature description"
git push origin feature/your-feature-name
```

### Database Changes

1. **Update schema** in `packages/database/schema.zmodel`

2. **Generate migration**:
```bash
bun run migrate
```

3. **Generate types**:
```bash
bun run generate
```

### Adding Dependencies

```bash
# Add to root workspace
bun add -D package-name

# Add to specific package
cd apps/api
bun add package-name

# Add to specific package (workspace)
bun add package-name --filter=api
```

## 🧪 Testing

```bash
# Run all tests
bun run test

# Run E2E tests
bun run test:e2e

# Run tests in specific package
cd apps/api
bun run test
```

## 📝 Code Style

The project uses:
- **oxlint** for linting TypeScript
- **Prettier** for code formatting
- **lint-staged** for pre-commit hooks

Code is automatically formatted on commit via Husky hooks.

## 🌍 Internationalization

The web app supports multiple languages:
- Spanish (es) - Default
- English (en)

To add translations:

1. Add translation keys using Lingui macros
2. Run `bun run locales:gen` in `apps/web`
3. Edit translation files in `apps/web/src/locales/messages/`

## 🔒 Security

- **Authentication**: Secure session-based auth with Better Auth
- **Database**: Row-level security policies with ZenStack
- **API**: CORS configuration
- **Secrets**: Environment variables for sensitive data
- **Password**: Secure password hashing
- **OAuth**: Social login with Google and GitHub

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Check if PostgreSQL is running
pg_isready

# Reset database (caution: deletes all data)
bun run migrate:reset
```

### Build Errors

```bash
# Clean node_modules and reinstall
rm -rf node_modules
rm bun.lock
bun install

# Clear Next.js cache
cd apps/web
rm -rf .next
```

### Port Conflicts

Default ports:
- API: 3000
- Web: 4000

To use different ports:

```bash
# API (edit apps/api/nitro.config.ts)
# Web
cd apps/web
bun run dev -- -p 4001
```

## 📄 License

UNLICENSED - This is private/proprietary software.

## 👥 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📧 Support

For issues, questions, or contributions, please:
- Open an issue on GitHub
- Contact the maintainers

## 🙏 Acknowledgments

- Built with [Turborepo](https://turborepo.com)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Medical terminology via [UMLS](https://www.nlm.nih.gov/research/umls/)

---

**Note**: This project is under active development. Features and documentation may change.
