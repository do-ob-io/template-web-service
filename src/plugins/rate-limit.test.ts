import Fastify from 'fastify';
import { describe, it, expect } from 'vitest';

import rateLimitPlugin from './rate-limit.ts';

describe('rate-limit plugin', () => {
  it('adds rate-limit headers to responses', async () => {
    const app = Fastify({ logger: false });
    app.register(rateLimitPlugin);
    // The route must be defined inside a plugin so it is processed
    // after the rate-limit onRoute hook is installed.
    app.register(async (instance) => {
      instance.get('/test', async () => ({ ok: true }));
    });
    await app.ready();

    const response = await app.inject({ method: 'GET', url: '/test' });

    expect(response.statusCode).toBe(200);
    expect(response.headers['x-ratelimit-limit']).toBeDefined();
    expect(response.headers['x-ratelimit-remaining']).toBeDefined();
    await app.close();
  });
});
