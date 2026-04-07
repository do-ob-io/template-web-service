import rateLimit from '@fastify/rate-limit';
import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

/**
 * Registers rate limiting for request throttling.
 *
 * @param app - The Fastify instance to register rate limiting on.
 */
async function rateLimitPlugin(app: FastifyInstance): Promise<void> {
  await app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  });
}

export default fp(rateLimitPlugin, { name: 'rate-limit' });
