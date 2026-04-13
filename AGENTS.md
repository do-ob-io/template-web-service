# Template Web Service Application

Fastify backend web service with modular architecture, fully-typed routes using `@fastify/type-provider-json-schema-to-ts` and `as const` JSON Schema definitions. Plugins and modules are auto-loaded via `@fastify/autoload`.

## Quality Instructions

- **Typecheck**: `tsc --noEmit`
- **Lint**: `pnpm lint`
- **Test**: `pnpm test`
- **Build**: `pnpm build`

## Structure

- `src/app.ts` — Fastify server entry point; exports `createApp()` and calls `start()`
- `src/otel.ts` — OpenTelemetry SDK initialisation; imported at the top of `app.ts` before Fastify is created
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
- Each module has a single `<name>.test.ts` with three `describe` blocks: **service** (pure unit), **controller** (mock reply with `vi.fn()`), **routes** (`app.inject()` integration)

## Plugin Conventions

- Each plugin file in `src/plugins/` exports a default `fastify-plugin`-wrapped function
- Plugins affect the global Fastify scope (not encapsulated)
- Each plugin has a colocated `<name>.test.ts` that registers the plugin on a fresh Fastify instance and asserts its observable effects via `app.inject()`
- When testing routes that depend on a `fastify-plugin` (e.g. rate-limit), declare the test route inside a child `app.register()` call so the plugin's `onRoute` hook fires before the route is registered

## Technical Stack

- **Language**: TypeScript
- **Server**: Fastify + `@fastify/compress` + `@fastify/cors` + `@fastify/helmet` + `@fastify/rate-limit` + `@fastify/sensible`
- **Auto-loading**: `@fastify/autoload` (plugins and modules)
- **Type provider**: `@fastify/type-provider-json-schema-to-ts` (infers handler types from `as const` schemas)
- **Observability**: `@fastify/otel` (OpenTelemetry auto-instrumentation) + `@opentelemetry/sdk-node`
- **Settings validation**: Zod (in `src/settings.ts` only)
- **Build Tool**: tsdown (compiles TypeScript preserving directory structure)
- **Dev runner**: `tsx` (runs TypeScript directly without a build step)

## OpenTelemetry

The OTEL SDK is initialised in `src/otel.ts` and imported as the very first statement in `src/app.ts`. `FastifyOtelInstrumentation` uses `registerOnInitialization: true` so it automatically attaches to every Fastify instance before any routes are defined.

Configure via environment variables (no code changes required):

| Variable | Default | Description |
| --- | --- | --- |
| `OTEL_SERVICE_NAME` | _(none)_ | Service name shown in traces |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | `http://localhost:4318` | OTLP collector endpoint |
| `OTEL_TRACES_EXPORTER` | `otlp` | Set to `none` to disable trace export |

To skip telemetry for a specific route, add `config: { otel: false }` to the route options.

## Sensible Conventions

- **HTTP errors in controllers**: throw `fastify.httpErrors.<errorName>([message])` (e.g., `fastify.httpErrors.notFound()`, `fastify.httpErrors.unauthorized()`) instead of raw `Error` objects
- **HTTP errors in reply**: use shorthand decorators `reply.notFound()`, `reply.badRequest()`, etc. for synchronous handlers
- **Route error response schemas**: reference the shared schema via `{ $ref: 'HttpError' }` for 4xx/5xx response entries
- **Assertions**: use `fastify.assert(condition, statusCode, message)` or `fastify.assert.ok()` etc. to validate preconditions in controllers
- **Async error unwrapping**: use `const [err, result] = await fastify.to(promise)` to avoid try/catch boilerplate

## Build Output

- `dist/` — Compiled JavaScript preserving source directory structure
- Run with: `NODE_ENV=production node dist/app.mjs`
