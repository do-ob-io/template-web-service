import type { FastifyInstance } from 'fastify';

import { healthRoutes } from './health.routes.ts';

/**
 * Health module entry point.
 *
 * Registers all health-related routes and configuration.
 *
 * @param app - The Fastify instance.
 */
export default async function healthModule(app: FastifyInstance): Promise<void> {
  await healthRoutes(app);
}
