# Components Requiring Updates for TanStack Start

This file lists all components that use Next.js-specific APIs and need to be updated.

## Navigation Components

### Replace `next/link` with TanStack Router's `Link`

**Files to update:**
- `src/components/app-sidebar/nav-main.tsx`
- `src/components/app-sidebar/nav-user.tsx`

**Change:**
```typescript
// Before
import Link from 'next/link'

// After  
import { Link } from '@tanstack/react-router'
```

## Dynamic Imports

### Replace `next/dynamic` with React lazy + Suspense

**Files to update:**
- `src/sections/auth/login/components/social-login-buttons.tsx`
- `src/sections/auth/login/components/last-used-method.tsx`

**Change:**
```typescript
// Before
import dynamic from 'next/dynamic'
const Component = dynamic(() => import('./component'), { ssr: false })

// After
import { lazy, Suspense } from 'react'
const Component = lazy(() => import('./component'))

// Usage:
<Suspense fallback={<div>Loading...</div>}>
  <Component />
</Suspense>
```

## Navigation Hooks

### Replace `next/navigation` hooks with TanStack Router hooks

**Files to update:**
- `src/hooks/use-locale.ts`

**Changes:**
```typescript
// Before
import { useParams, useSearchParams } from 'next/navigation'
const params = useParams()
const searchParams = useSearchParams()

// After
import { useParams, useSearch } from '@tanstack/react-router'
const params = useParams({ from: '__root__' })
const search = useSearch({ from: '__root__' })
```

## Server Actions

### Replace `next-safe-action` with TanStack Start server functions

**Files to update:**
- `src/sections/model/components/test-connection-button.tsx`
- `src/sections/model/components/dialogs/delete-model-alert-dialog.tsx`
- `src/sections/model/form/edit-model-form-container.tsx`
- `src/sections/model/form/create-model-form-container.tsx`
- `src/sections/preset/components/dialogs/delete-preset-alert-dialog-content.tsx`
- `src/sections/preset/components/dialogs/clone-preset-alert-dialog-content.tsx`
- `src/sections/preset/form/edit-preset-form-container.tsx`
- `src/sections/preset/form/create-preset-form-container.tsx`
- `src/sections/auth/login/components/social-login-buttons.tsx`
- `src/sections/analysis/components/dialogs/delete-analysis-alert-dialog.tsx`

**Changes:**
```typescript
// Before
import { useAction } from 'next-safe-action/hooks'
const { execute, isPending } = useAction(serverAction)

// After
import { useMutation } from '@tanstack/react-query'
import { createServerFn } from '@tanstack/start'

// In server file (e.g., src/server/actions.ts)
export const deleteModel = createServerFn({ method: 'POST' })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    // server-side logic
  })

// In component
import { deleteModel } from '@/server/actions'
const mutation = useMutation({
  mutationFn: deleteModel,
})
const { mutate, isPending } = mutation
```

## Images

Check if any components use `next/image`:
```bash
grep -r "from 'next/image" src/
```

If found, replace with:
- Standard `<img>` tags
- Or use a Vite-compatible image optimization library

## Environment Variables

### Update environment variable access

**Next.js:**
- `process.env.NEXT_PUBLIC_*` for client-side
- `process.env.*` for server-side

**TanStack Start / Vite:**
- `import.meta.env.VITE_*` for client-side (needs update in vite config)
- `process.env.*` still works for server-side

**Note:** You may need to update env variable names and references throughout the app.

## Summary

Total files requiring updates: **~15-20 files**

Priority order:
1. Navigation (Link components) - High priority for basic routing
2. Hooks (useParams, useSearchParams) - High priority for functionality  
3. Server Actions - High priority for data mutations
4. Dynamic imports - Medium priority (can fallback to regular imports temporarily)
5. Environment variables - Check and update as needed
