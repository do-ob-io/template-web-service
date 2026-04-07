import helmet from '@fastify/helmet';
import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

/**
 * Registers security headers via Helmet.
 *
 * @param app - The Fastify instance to register Helmet on.
 */
async function helmetPlugin(app: FastifyInstance): Promise<void> {
  await app.register(helmet);
}

export default fp(helmetPlugin, { name: 'helmet' });
