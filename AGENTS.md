# Template Web Service Application

Fastify backend web service with fully-typed routes using Zod validation via `fastify-type-provider-zod`.

## Quality Instructions

- **Typecheck**: `tsc --noEmit`
- **Lint**: `eslint --fix .`
- **Build**: `pnpm build`

## Structure

- `src/app.ts` — Fastify server entry point; exports `createApp()` and calls `start()`
- `vite.config.ts` — Vite config for building the application bundle (`dist/app.cjs`)

## Route Conventions

- Use `app.withTypeProvider<ZodTypeProvider>()` to get a fully-typed Fastify instance
- Define `schema.body`, `schema.params`, `schema.querystring`, and `schema.response` using `z.object()`
- All route handlers receive fully-inferred TypeScript types for request body, params, and reply
- Group related routes into separate plugin files under `src/routes/` and register them via `app.register()`

## Example Typed Route

```typescript
const typed = app.withTypeProvider<ZodTypeProvider>();

typed.post(
  "/example",
  {
    schema: {
      body: z.object({ name: z.string() }),
      response: { 200: z.object({ message: z.string() }) },
    },
  },
  async (request, reply) => {
    return reply.send({ message: `Hello, ${request.body.name}` });
  },
);
```

## Technical Stack

- **Language**: TypeScript
- **Server**: Fastify + `@fastify/compress`
- **Validation**: Zod via `fastify-type-provider-zod`
- **Build Tool**: Vite (SSR bundle → `dist/app.cjs`)
- **Dev runner**: `tsx` (runs TypeScript directly without a build step)

## Build Output

- `dist/app.cjs` — Bundled server entry (CJS format, minified via esbuild)
- Run with: `NODE_ENV=production node dist/app.cjs`
