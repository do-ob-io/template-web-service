import sensible from '@fastify/sensible';
import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

/**
 * Registers @fastify/sensible utilities on the Fastify instance.
 *
 * Adds HTTP error constructors (`fastify.httpErrors.*`), shorthand reply
 * decorators (`reply.notFound()`, etc.), assertion helpers (`fastify.assert`),
 * and a promise error-unwrap helper (`fastify.to`).
 *
 * A shared JSON Schema with id `HttpError` is added and can be referenced in
 * route response schemas via `{ $ref: 'HttpError' }`.
 *
 * @param app - The Fastify instance to register sensible on.
 */
async function sensiblePlugin(app: FastifyInstance): Promise<void> {
  await app.register(sensible, { sharedSchemaId: 'HttpError' });
}

export default fp(sensiblePlugin, { name: 'sensible' });
