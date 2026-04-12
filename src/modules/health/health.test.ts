import type { FastifyReply, FastifyRequest } from 'fastify';
import Fastify from 'fastify';
import { describe, it, expect, vi } from 'vitest';

import { healthController } from './health.controller.ts';
import { healthRoutes } from './health.routes.ts';
import { healthResponseSchema } from './health.schema.ts';
import { getHealthStatus } from './health.service.ts';

describe('health service', () => {
  it('returns status ok', () => {
    expect(getHealthStatus()).toEqual({ status: 'ok' });
  });
});

describe('health controller', () => {
  it('sends the health status via reply', async () => {
    const request = {} as FastifyRequest;
    const reply = { send: vi.fn() } as unknown as FastifyReply;

    await healthController(request, reply);

    expect(reply.send).toHaveBeenCalledWith({ status: 'ok' });
  });
});

describe('health routes', () => {
  it('GET /health returns 200 with status ok', async () => {
    const app = Fastify({ logger: false });
    await healthRoutes(app);
    await app.ready();

    const response = await app.inject({ method: 'GET', url: '/health' });
    const body = response.json<{ status: string }>();

    expect(response.statusCode).toBe(200);
    expect(body.status).toBe('ok');
    await app.close();
  });

  it('GET /health response conforms to the health response schema shape', async () => {
    const app = Fastify({ logger: false });
    await healthRoutes(app);
    await app.ready();

    const response = await app.inject({ method: 'GET', url: '/health' });
    const body = response.json<Record<string, unknown>>();

    expect(Object.keys(body)).toEqual(
      expect.arrayContaining([ ...healthResponseSchema.required ]),
    );
    await app.close();
  });
});
