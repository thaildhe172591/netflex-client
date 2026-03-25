# Repository Guidelines

## Project Structure & Module Organization
- `src/app`: Next.js App Router entry, route groups like `(auth)`, `(public)`, `(user)`, plus shared layouts and error pages. API route handlers live under `src/app/api`.
- `src/components`: Reusable UI and shared components (Shadcn-style components often live in `src/components/ui`).
- `src/lib`: Utilities and cross-cutting helpers.
- `src/hooks`: Custom React hooks.
- `src/stores`: Client-side state (Zustand).
- `src/models` and `src/constants`: Domain types and shared constants.
- `public`: Static assets served as-is.

## Build, Test, and Development Commands
- `npm run dev`: Start the Next.js dev server with Turbopack.
- `npm run build`: Production build.
- `npm run start`: Run the production server (after build).
- `npm run lint`: Run ESLint with Next.js rules.

## Coding Style & Naming Conventions
- TypeScript + React, strict mode enabled (`tsconfig.json`).
- Indentation is 2 spaces, strings use double quotes, semicolons are used.
- Path aliases are configured: use `@/` for `src` imports (example: `@/components/Button`).
- Styling uses Tailwind CSS v4 (`src/app/globals.css` + `@tailwindcss/postcss`).

## Testing Guidelines
- No test runner or `npm test` script is currently configured. If you add tests, introduce a runner (e.g., Vitest or Playwright) and document the command here.
- For now, validate changes with `npm run lint` and a local manual smoke test via `npm run dev`.

## Commit & Pull Request Guidelines
- Recent commits use very short subjects like `update`. Prefer concise, descriptive, imperative subjects to improve history readability (example: `add auth callback route`).
- PRs should include a brief summary, linked issue (if any), and screenshots for UI changes. Note any config/env changes explicitly.

## Configuration Notes
- Server-side route handlers expect `BASE_API_URL` to be set for proxy/auth flows (see `src/app/api`).
- Ensure `.env.local` is excluded from commits and document any new required variables in the PR.
