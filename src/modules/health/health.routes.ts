import type { FastifyInstance } from 'fastify';

import { healthController } from './health.controller.ts';
import { healthResponseSchema } from './health.schema.ts';

/**
 * Registers health check routes.
 *
 * @param app - The Fastify instance to register routes on.
 */
export async function healthRoutes(app: FastifyInstance): Promise<void> {
  /**
   * GET /health
   *
   * Health check endpoint. Returns the current service status.
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
    healthController,
  );
}
