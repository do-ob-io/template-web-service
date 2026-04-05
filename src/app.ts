import compress from '@fastify/compress';
import Fastify from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { z } from 'zod';

const port = Number(process.env['PORT'] ?? 3000);

/**
 * Creates and configures the Fastify application instance.
 *
 * Registers compression, installs the Zod type provider for fully-typed
 * request validation and response serialization, and mounts all routes.
 *
 * @returns The configured Fastify instance.
 */
export async function createApp() {
  const app = Fastify({ logger: { level: 'error' } });

  // Zod type provider: validates incoming requests and serializes responses
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  await app.register(compress);

  const typed = app.withTypeProvider<ZodTypeProvider>();

  /**
   * GET /health
   *
   * Health check endpoint. Returns the current service status.
   *
   * @returns `{ status: 'ok' }`
   */
  typed.get(
    '/health',
    {
      schema: {
        response: {
          200: z.object({
            status: z.string(),
          }),
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
  typed.post(
    '/echo',
    {
      schema: {
        body: z.object({
          message: z.string(),
        }),
        response: {
          200: z.object({
            message: z.string(),
          }),
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
  await app.listen({ port, host: '0.0.0.0' });
  console.log(`Server started at http://localhost:${port}`);
}

// CJS bundles do not support top-level await; wrap in an async IIFE instead.
// eslint-disable-next-line unicorn/prefer-top-level-await
void (async () => {
  await start();
})();


