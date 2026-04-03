# Template Web Service Application

Fastify web server with Vite-powered React SSR using TanStack Router for file-based routing. Supports both development (HMR middleware mode) and production (pre-built static + server bundles).

## Quality Instructions

- **Typecheck**: `tsc --noEmit`
- **Lint**: `eslint --fix .`
- **Build**: `pnpm build`

## Structure

- `src/app.ts` — Fastify server entry point with Vite SSR middleware integration
- `src/frontend/` — React frontend (client/server entry points, router, routes)
- `src/frontend/router.tsx` — TanStack Router factory (shared between server and client)
- `src/frontend/routes/` — File-based route directory (TanStack Router)
- `src/frontend/routes/__root.tsx` — Root layout route wrapping all pages
- `src/frontend/routes/page.tsx` — Index page (`/`) route
- `src/frontend/route-tree.gen.ts` — Auto-generated route tree (do not edit)
- `src/frontend/entry-client.tsx` — Client-side hydration entry
- `src/frontend/entry-server.tsx` — Server-side render entry
- `vite.config.ts` — Vite config for the React frontend with TanStack Router plugin
- `vite.config.app.ts` — Vite config for building the Fastify server bundle

## File-Based Routing Conventions

- **Index token**: `page` — Use `page.tsx` as the page component (like Next.js)
- **Ignore pattern**: `^_(?!_)` — Files/directories starting with a single `_` are excluded (but `__root` is preserved)
- **Route token**: `route` — Use `route.tsx` for route configuration (loaders, head, etc.)
- **Root route**: `__root.tsx` — Defines the shared layout for all routes
- Routes are defined under `src/frontend/routes/` and auto-discovered by the Vite plugin
- `route-tree.gen.ts` is auto-generated — do not modify manually

## Technical Stack

- **Language**: TypeScript
- **Server**: Fastify (@fastify/compress, @fastify/middie, @fastify/static)
- **Frontend**: React 19 with TanStack Router and Vite SSR
- **Routing**: TanStack Router (file-based, SSR-compatible)
- **Build Tool**: Vite (three-stage build: app, client, server)
