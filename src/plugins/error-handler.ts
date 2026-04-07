import type { FastifyError, FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

/**
 * Registers a global error handler for the application.
 *
 * Logs the error and returns a structured JSON error response.
 *
 * @param app - The Fastify instance to register the error handler on.
 */
async function errorHandlerPlugin(app: FastifyInstance): Promise<void> {
  app.setErrorHandler(async (error: FastifyError, request, reply) => {
    request.log.error(error);
    const statusCode = error.statusCode ?? 500;
    return reply.status(statusCode).send({
      statusCode,
      error: error.name,
      message: error.message,
    });
  });
}

export default fp(errorHandlerPlugin, { name: 'error-handler' });
