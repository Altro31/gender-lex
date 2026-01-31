# Migration from Next.js to TanStack Start - Implementation Guide

This document provides details about the migration from Next.js 16 to TanStack Start and outlines remaining work.

## What Has Been Migrated

### ✅ Configuration Files
- **package.json**: Updated dependencies to replace Next.js with TanStack Start, Vinxi, and TanStack Router
- **app.config.ts**: Created Vinxi configuration with Vite plugins for TanStack Router, TypeScript paths, React Compiler, and PostCSS
- **tsconfig.json**: Updated to remove Next.js plugin and include route tree generation
- **.gitignore**: Updated to exclude TanStack Start build artifacts (.vinxi, .output, dist, routeTree.gen.ts)

### ✅ Core Application Structure
- **src/router.tsx**: Router configuration with TanStack Router
- **src/entry-client.tsx**: Client-side hydration entry point
- **src/entry-server.tsx**: Server-side rendering entry point
- **src/routes/__root.tsx**: Root route with all providers (Theme, Lingui, Query, EventSource, Sidebar, etc.)

### ✅ Page Routes (Migrated from Next.js App Router)
All routes have been converted from Next.js App Router format to TanStack Router file-based routing:

| Original Path | New Route File | Status |
|--------------|----------------|--------|
| `/[locale]/(domain)/page.tsx` | `/routes/index.tsx` | ✅ Migrated |
| `/[locale]/(domain)/analysis/page.tsx` | `/routes/analysis/index.tsx` | ✅ Migrated |
| `/[locale]/(domain)/analysis/[id]/page.tsx` | `/routes/analysis/$id.tsx` | ✅ Migrated |
| `/[locale]/(domain)/models/page.tsx` | `/routes/models.tsx` | ✅ Migrated |
| `/[locale]/(domain)/presets/page.tsx` | `/routes/presets.tsx` | ✅ Migrated |
| `/[locale]/(domain)/profile/page.tsx` | `/routes/profile.tsx` | ✅ Migrated (with loader) |
| `/[locale]/(security)/auth/login/page.tsx` | `/routes/auth/login.tsx` | ✅ Migrated |
| `/[locale]/(security)/auth/register/page.tsx` | `/routes/auth/register.tsx` | ✅ Migrated |
| `/[locale]/(security)/privacy/page.tsx` | `/routes/privacy.tsx` | ✅ Migrated |
| `/[locale]/(security)/terms/page.tsx` | `/routes/terms.tsx` | ✅ Migrated |

### ✅ API Routes to Server Functions
- **src/server/chat.ts**: Converted `/api/chat` POST endpoint to TanStack Start server function

### ✅ Documentation
- Updated README.md files to reflect TanStack Start technology stack
- Updated main repository README to show TanStack Start in architecture overview

## What Still Needs Work

### 🔄 Installation and Testing
The dependencies need to be installed properly. There were network/registry issues during the migration:
```bash
cd /home/runner/work/gender-lex/gender-lex
bun install
```

### 🔄 Remaining API Routes
The following API routes need to be migrated to TanStack Start server functions or API routes:

1. **src/app/api/auth/[...all]/route.ts** - Better Auth handler
   - This is a catch-all route for Better Auth
   - May need to be handled as a custom API route in Vinxi or adapted for TanStack Start

2. **src/app/api/sse/route.ts** - Server-Sent Events proxy
   - Needs to be adapted for TanStack Start's streaming approach
   - May require Vinxi custom handler

3. **src/app/api/proxy/[...all]** - Dynamic proxy endpoint
   - Catch-all proxy route that may need custom Vinxi handling

### 🔄 Middleware Migration
The current middleware system in `src/proxy.ts` needs to be adapted:

**Current Middleware Features:**
- `protectedRoutes`: Redirects unauthenticated users from protected routes
- `rejectAuthRoutes`: Prevents logged-in users from accessing auth pages
- `routingMiddleware`: Locale detection and redirection

**TanStack Router Approach:**
- Use `beforeLoad` in route definitions for authentication checks
- Implement locale handling via router configuration or a wrapper component
- Consider using TanStack Router's built-in navigation guards

### 🔄 Locale Handling
The original app uses `[locale]` dynamic segment for i18n routing. TanStack Start options:

1. **Option A**: Implement locale as a search parameter or context
2. **Option B**: Use a custom route configuration with locale prefix
3. **Option C**: Handle locale at the root layout level without route segments

Current implementation in `__root.tsx` hardcodes Spanish locale - this needs to be dynamic.

### 🔄 Server Actions
The app has several "use server" functions that need migration:
- PWA actions
- Services: preset, profile, auth, analysis, model

Convert these to TanStack Start server functions using `createServerFn`.

### 🔄 Metadata and SEO
Next.js `generateMetadata` functions were removed. Implement SEO using:
- TanStack Router's `meta` option in route definitions
- Or use React Helmet/React Head for dynamic metadata

### 🔄 Loading States
Next.js `loading.tsx` files need to be converted to:
- TanStack Router's `pendingComponent` option
- Or manual loading state handling with `useIsFetching` / route navigation state

### 🔄 Static Generation
Next.js `generateStaticParams` was used for static generation. For TanStack Start:
- Use preloading strategies
- Configure build-time data fetching if needed
- Consider SSR vs SSG trade-offs

### 🔄 Image Optimization
If using Next.js Image component, it needs to be replaced with:
- Standard `<img>` tags
- A third-party image optimization service
- Vite's static asset handling

### 🔄 Build and Dev Scripts
**Root package.json scripts to verify:**
- `dev`: Already updated to use turborepo
- `build:web`: Should call `vinxi build` 
- `prod:web`: Already updated to use `vinxi start`

## Testing Checklist

Once dependencies are installed, test the following:

- [ ] Dev server starts successfully (`bun run dev`)
- [ ] All routes are accessible
- [ ] Authentication flow works (login, register, logout)
- [ ] Protected routes redirect unauthenticated users
- [ ] Locale switching works correctly
- [ ] SSE/streaming responses work for analysis and chat
- [ ] API proxy functionality works
- [ ] Theme switching persists
- [ ] Forms and validation work
- [ ] File uploads work
- [ ] Build completes successfully (`bun run build`)
- [ ] Production server runs (`bun run start`)
- [ ] All components render correctly
- [ ] No TypeScript errors
- [ ] No runtime errors in console

## Key Differences: Next.js vs TanStack Start

### Routing
- **Next.js**: File-system routing in `app/` directory with automatic layouts
- **TanStack Start**: File-based routing in `routes/` directory with explicit route definitions

### Data Fetching
- **Next.js**: Server Components, `fetch` with caching, Server Actions
- **TanStack Start**: Client components with TanStack Query, server functions with `createServerFn`

### API Routes
- **Next.js**: `route.ts` files with `GET`, `POST` exports
- **TanStack Start**: Server functions or custom Vinxi handlers

### Layouts
- **Next.js**: `layout.tsx` files that automatically wrap children
- **TanStack Start**: `__root.tsx` and nested layouts using `<Outlet />`

### Middleware
- **Next.js**: `middleware.ts` file with matcher config
- **TanStack Start**: Route-level `beforeLoad` or custom Vinxi middleware

### Metadata
- **Next.js**: `generateMetadata` function
- **TanStack Start**: `meta` property in route config or third-party library

## Additional Resources

- [TanStack Start Documentation](https://tanstack.com/start)
- [TanStack Router Documentation](https://tanstack.com/router)
- [Vinxi Documentation](https://vinxi.vercel.app/)
- [Migration from Next.js to TanStack Start (Community Guide)](https://github.com/TanStack/router/discussions)

## Notes

- The migration maintains the same component structure and UI
- Most business logic and components remain unchanged
- The main changes are in routing, data fetching, and configuration
- Better Auth integration may need adaptation for TanStack Start
- Consider server-side rendering (SSR) requirements when implementing data loading
