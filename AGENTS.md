# Template Web Service Application

Fastify backend web service with modular architecture, fully-typed routes using `@fastify/type-provider-json-schema-to-ts` and `as const` JSON Schema definitions. Plugins and modules are auto-loaded via `@fastify/autoload`.

## Quality Instructions

- **Typecheck**: `tsc --noEmit`
- **Lint**: `eslint --fix .`
- **Build**: `pnpm build`

## Structure

- `src/app.ts` — Fastify server entry point; exports `createApp()` and calls `start()`
- `src/settings.ts` — Zod-validated environment settings; exports `SETTINGS` and `Settings` type
- `src/plugins/` — Fastify plugins auto-loaded at startup (compress, cors, helmet, rate-limit, error-handler, sensible, swagger)
- `src/modules/` — Business modules auto-loaded at startup; each module in `src/modules/<name>/` contains:
  - `<name>.module.ts` — Entry point registered by autoload
  - `<name>.routes.ts` — Route definitions and schema bindings
  - `<name>.controller.ts` — Request handlers calling services
  - `<name>.service.ts` — Business logic and data processing
  - `<name>.schema.ts` — `as const` JSON Schema definitions for the module
- `tsdown.config.ts` — tsdown config for building the application (`dist/`)

## Module Conventions

- Each module is a self-contained directory under `src/modules/`
- The `*.module.ts` file is the entry point loaded by `@fastify/autoload`
- Schemas are declared `as const` so `@fastify/type-provider-json-schema-to-ts` can statically infer handler types
- Controllers handle request/reply; services contain pure business logic

## Plugin Conventions

- Each plugin file in `src/plugins/` exports a default `fastify-plugin`-wrapped function
- Plugins affect the global Fastify scope (not encapsulated)

## Technical Stack

- **Language**: TypeScript
- **Server**: Fastify + `@fastify/compress` + `@fastify/cors` + `@fastify/helmet` + `@fastify/rate-limit` + `@fastify/sensible`
- **Auto-loading**: `@fastify/autoload` (plugins and modules)
- **Type provider**: `@fastify/type-provider-json-schema-to-ts` (infers handler types from `as const` schemas)
- **Settings validation**: Zod (in `src/settings.ts` only)
- **Build Tool**: tsdown (compiles TypeScript preserving directory structure)
- **Dev runner**: `tsx` (runs TypeScript directly without a build step)

## Sensible Conventions

- **HTTP errors in controllers**: throw `fastify.httpErrors.<errorName>([message])` (e.g., `fastify.httpErrors.notFound()`, `fastify.httpErrors.unauthorized()`) instead of raw `Error` objects
- **HTTP errors in reply**: use shorthand decorators `reply.notFound()`, `reply.badRequest()`, etc. for synchronous handlers
- **Route error response schemas**: reference the shared schema via `{ $ref: 'HttpError' }` for 4xx/5xx response entries
- **Assertions**: use `fastify.assert(condition, statusCode, message)` or `fastify.assert.ok()` etc. to validate preconditions in controllers
- **Async error unwrapping**: use `const [err, result] = await fastify.to(promise)` to avoid try/catch boilerplate

## Build Output

- `dist/` — Compiled JavaScript preserving source directory structure
- Run with: `NODE_ENV=production node dist/app.mjs`
