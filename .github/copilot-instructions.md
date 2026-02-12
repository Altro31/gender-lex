# Copilot Instructions for Gender-Lex

## Project Overview

- **Gender-Lex** is a full-stack TypeScript monorepo for analyzing gender bias in text, providing AI-powered suggestions and a floating AI chatbot.
- **Monorepo structure** (Turborepo):
  - `apps/api`: Backend API (Hono + Bun)
  - `apps/web`: Frontend (Next.js 16)
  - `packages/database`: Database & schema (ZenStack + Prisma)
  - `packages/auth`: Authentication (Better Auth)
  - `packages/types`: Shared TypeScript types

## Key Architectural Patterns

- **API**: Built with Hono (Bun runtime), uses Effect for functional programming, and integrates with PostgreSQL via Prisma/ZenStack.
- **Web**: Next.js 16 (App Router), React 19, Tailwind CSS 4, Zustand for state, TanStack Query for data fetching, Lingui for i18n.
- **Database**: ZenStack for schema and access control, Prisma for ORM, managed in `packages/database`.
- **Authentication**: Provided by `@repo/auth` (Better Auth), supports email/password, OAuth, and anonymous sessions.
- **AI/LLM**: Uses AI SDK, OpenAI-compatible providers, and Gemini AI for chatbot and analysis.
- **Workflows**: Custom workflow engine for multi-step analysis pipelines in `apps/api/src/modules/workflows`.

## Developer Workflows

- **Install dependencies**: `bun install` (root)
- **Run API**: `bun dev` in `apps/api`
- **Run Web**: `bun dev` in `apps/web`
- **Database migrations**: Use Prisma CLI in `packages/database` (see README for details)
- **Test (load, smoke, stress)**: K6 scripts in `apps/api/test/k6/`
- **API docs**: `/swagger` endpoint (auto-generated)

## Project-Specific Conventions

- **Effect** is used for functional programming in API and database logic.
- **All shared types** are in `packages/types` and imported via `@repo/types`.
- **Database access** is always through ZenStack/Prisma clients from `@repo/db`.
- **AI/LLM integration** is abstracted via AI SDK; do not call providers directly.
- **Workflows** are modular and live in `apps/api/src/modules/workflows`.
- **Internationalization**: Use Lingui in web, with locales in `apps/web/src/locales`.
- **Styling**: Tailwind CSS 4, with custom themes and animations.

## Integration Points

- **API ↔ Web**: REST endpoints, SSE for streaming, OpenAPI docs.
- **API ↔ Database**: Prisma/ZenStack, with access control enforced at schema level.
- **API ↔ AI**: AI SDK for all LLM/model calls.
- **Web ↔ Auth**: Uses `@repo/auth/next` for client-side auth.

## Examples

- **Add a new analysis workflow**: Place module in `apps/api/src/modules/workflows/start-analysis/` and register in API.
- **Add a new AI model**: Update model config in `apps/api` and `packages/database/schema.zmodel`.
- **Add a new locale**: Add translation files to `apps/web/src/locales` and update Lingui config.

## References

- See each package's `README.md` for more details and usage examples.
- For database schema, see `packages/database/schema.zmodel`.
- For authentication, see `packages/auth/README.md`.
- For workflows, see `apps/api/src/modules/workflows/`.

---

For questions or unclear patterns, check the relevant package README or ask for clarification.
