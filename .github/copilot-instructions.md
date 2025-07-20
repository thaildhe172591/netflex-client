# Netflex Client AI Development Guide

This document provides essential context for AI agents working with the Netflex client codebase - a Next.js-based streaming platform frontend.

## Project Architecture

### App Structure

- `/src/app/` - Next.js App Router pages organized by access level:
  - `(auth)/*` - Authentication related pages (login, register, etc.)
  - `(public)/*` - Public accessible content (movies, series, episodes)
  - `(user)/*` - User-specific features (settings, notifications)
  - `admin/*` - Admin panel features
  - `@modal/*` - Modal route interception patterns

### Key Technical Patterns

1. **API Integration**

   - REST API client in `/src/lib/api-client/`
   - Uses Axios with typed endpoints following `/docs/api-backend.md` specs
   - API proxy utils in `/src/lib/api-proxy/` for server-side calls

2. **State Management**

   - React Query for server state (`@tanstack/react-query`)
   - Zustand for client state (see `src/stores/`)
   - Query key constants in `src/constants/query-keys.ts`

3. **UI Components**

   - Radix UI primitives with custom styling
   - Shared components in `/src/components/ui/`
   - Page-specific components colocated in `_components/` folders
   - Component examples:
     - `hls-video-player.tsx` - Video streaming component
     - `data-table.tsx` - Reusable table with sorting/filtering
     - `file-uploader.tsx` - File upload handling

4. **Authentication & Authorization**
   - Role-based access control (`src/constants/roles.ts`)
   - Auth state management via `useAuth` hook
   - Protected route patterns in route group layouts

## Development Workflow

### Common Commands

```bash
npm run dev     # Start dev server with Turbopack
npm run build   # Production build
npm run lint    # Run ESLint
```

### Key Files for New Features

1. Add new API client in `src/lib/api-client/`
2. Create model types in `src/models/`
3. Add query keys in `src/constants/query-keys.ts`
4. Implement UI components in relevant route group

## Common Patterns

1. **Form Handling**

   - Use `react-hook-form` with Zod validation
   - See examples in auth forms under `src/app/(auth)/_components/`

2. **Modal Patterns**

   - Use route interceptors in `@modal` folder
   - See `src/app/@modal/(.)login/` for reference

3. **Data Tables**
   - Extend `data-table.tsx` component
   - Implement column definitions per feature
   - See admin tables for examples

## Important Notes

- Always use the API proxy for server-side API calls
- Co-locate feature-specific components in `_components/` folders
- Follow existing patterns for modal route interception
- Use the UI component library from `src/components/ui/` for consistency
