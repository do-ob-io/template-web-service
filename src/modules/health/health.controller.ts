import type { FastifyReply, FastifyRequest } from 'fastify';

import { getHealthStatus } from './health.service.ts';

/**
 * Handles the health check request.
 *
 * @param _request - The incoming Fastify request.
 * @param reply - The Fastify reply object.
 * @returns The health status response.
 */
export async function healthController(
  _request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const status = getHealthStatus();
  return reply.send(status);
}
