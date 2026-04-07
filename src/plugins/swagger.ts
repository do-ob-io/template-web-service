import swagger from '@fastify/swagger';
import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

/**
 * Registers OpenAPI v3 spec generation and mounts the spec endpoint.
 *
 * Configures `@fastify/swagger` with OpenAPI v3 document metadata and adds a
 * `GET /openapi.json` route that returns the fully-generated specification.
 * This plugin must be registered before any routes so that all route schemas
 * are captured in the generated spec.
 *
 * @param app - The Fastify instance to register swagger on.
 */
async function swaggerPlugin(app: FastifyInstance): Promise<void> {
  await app.register(swagger, {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: 'Template Web Service',
        description: 'Fastify backend web service',
        version: '0.0.0',
      },
    },
  });

  /**
   * GET /openapi.json
   *
   * Returns the generated OpenAPI v3 specification document.
   */
  app.get('/openapi.json', { schema: { hide: true } }, async (_request, reply) => {
    return reply.send(app.swagger());
  });
}

export default fp(swaggerPlugin, { name: 'swagger' });
