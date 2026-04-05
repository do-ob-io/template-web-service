import compress from '@fastify/compress';
import type { JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts';
import Fastify from 'fastify';

import { swaggerPlugin } from '@/plugins/index.js';
import {
  echoBodySchema,
  echoResponseSchema,
  healthResponseSchema,
} from '@/schemas/index.js';
import { SETTINGS } from '@/settings.js';


/**
 * Creates and configures the Fastify application instance.
 *
 * Registers compression and mounts all routes. Request bodies are validated
 * at runtime against JSON Schemas defined in `src/schemas/`. TypeScript types
 * for handlers are inferred automatically by `@fastify/type-provider-json-schema-to-ts`.
 *
 * @returns The configured Fastify instance.
 */
export async function createApp() {
  const app = Fastify({ logger: { level: 'error' } }).withTypeProvider<JsonSchemaToTsProvider>();

  await swaggerPlugin(app);
  await app.register(compress);

  /**
   * GET /health
   *
   * Health check endpoint. Returns the current service status.
   *
   * @returns `{ status: 'ok' }`
   */
  app.get(
    '/health',
    {
      schema: {
        response: {
          200: healthResponseSchema,
        },
      },
    },
    async (_request, reply) => {
      return reply.send({ status: 'ok' });
    },
  );

  /**
   * POST /echo
   *
   * Echo endpoint. Returns the message sent in the request body.
   *
   * @param body.message - The message string to echo back.
   * @returns `{ message: string }`
   */
  app.post(
    '/echo',
    {
      schema: {
        body: echoBodySchema,
        response: {
          200: echoResponseSchema,
        },
      },
    },
    async (request, reply) => {
      return reply.send({ message: request.body.message });
    },
  );

  return app;
}

/**
 * Starts the HTTP server.
 *
 * @throws When the server fails to bind to the configured port.
 */
async function start(): Promise<void> {
  const app = await createApp();
  await app.ready();
  await app.swagger(); // Pre-generate OpenAPI spec before accepting requests
  const port = Number(SETTINGS.PORT);
  await app.listen({ port, host: '0.0.0.0' });
  console.log(`Server started at http://localhost:${port}`);
}

// CJS bundles do not support top-level await; wrap in an async IIFE instead.
// eslint-disable-next-line unicorn/prefer-top-level-await
void (async () => {
  await start();
})();


