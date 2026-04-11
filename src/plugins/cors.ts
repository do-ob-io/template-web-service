import cors from '@fastify/cors';
import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

import { SETTINGS } from '../settings.ts';

/**
 * Registers CORS headers for cross-origin requests.
 *
 * @param app - The Fastify instance to register CORS on.
 */
async function corsPlugin(app: FastifyInstance): Promise<void> {
  await app.register(cors, {
    ...(SETTINGS.CORS_ORIGIN !== undefined && {
      origin: SETTINGS.CORS_ORIGIN,
    }),
  });
}

export default fp(corsPlugin, { name: 'cors' });
