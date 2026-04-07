import compress from '@fastify/compress';
import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

/**
 * Registers HTTP response compression.
 *
 * @param app - The Fastify instance to register compression on.
 */
async function compressPlugin(app: FastifyInstance): Promise<void> {
  await app.register(compress);
}

export default fp(compressPlugin, { name: 'compress' });
