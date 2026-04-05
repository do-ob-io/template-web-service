# Template Web Service Application

Fastify backend web service with fully-typed routes using `@fastify/type-provider-json-schema-to-ts` and `as const` JSON Schema definitions.

## Quality Instructions

- **Typecheck**: `tsc --noEmit`
- **Lint**: `eslint --fix .`
- **Build**: `pnpm build`

## Structure

- `src/app.ts` — Fastify server entry point; exports `createApp()` and calls `start()`
- `src/settings.ts` — Zod-validated environment settings; exports `SETTINGS` and `Settings` type
- `src/schemas/` — `as const` JSON Schema definitions; each file groups schemas by domain and re-exports from `index.ts`
- `vite.config.ts` — Vite config for building the application bundle (`dist/app.cjs`)

## Route Conventions

- Define all route schemas as `as const` JSON Schema objects
- `as const` is required so `@fastify/type-provider-json-schema-to-ts` can statically infer handler types
- Pass schemas directly to the Fastify `schema` option; no explicit generic type params needed
- Group related routes into separate plugin files under `src/routes/` and register them via `app.register()`

## Example Typed Route

```typescript
// src/schemas/index.ts
export const exampleBodySchema = {
  type: "object",
  properties: { name: { type: "string" } },
  required: ["name"],
  additionalProperties: false,
} as const;

// src/app.ts
app.post(
  "/example",
  {
    schema: {
      body: exampleBodySchema,
      response: { 200: exampleResponseSchema },
    },
  },
  async (request, reply) => {
    // request.body.name is inferred as string
    return reply.send({ message: `Hello, ${request.body.name}` });
  },
);
```

## Technical Stack

- **Language**: TypeScript
- **Server**: Fastify + `@fastify/compress`
- **Type provider**: `@fastify/type-provider-json-schema-to-ts` (infers handler types from `as const` schemas)
- **Settings validation**: Zod (in `src/settings.ts` only)
- **Build Tool**: Vite (SSR bundle → `dist/app.cjs`)
- **Dev runner**: `tsx` (runs TypeScript directly without a build step)

## Build Output

- `dist/app.cjs` — Bundled server entry (CJS format, minified via esbuild)
- Run with: `NODE_ENV=production node dist/app.cjs`
