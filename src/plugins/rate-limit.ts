import rateLimit from '@fastify/rate-limit';
import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

import { SETTINGS } from '../settings.ts';

/**
 * Registers rate limiting for request throttling.
 *
 * @param app - The Fastify instance to register rate limiting on.
 */
async function rateLimitPlugin(app: FastifyInstance): Promise<void> {
  await app.register(rateLimit, {
    max: Number.parseInt(SETTINGS.RATE_LIMIT_MAX, 10),
    timeWindow: SETTINGS.RATE_LIMIT_TIME_WINDOW,
  });
}

export default fp(rateLimitPlugin, { name: 'rate-limit' });
