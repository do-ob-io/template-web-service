import Fastify from 'fastify';
import { describe, it, expect } from 'vitest';

import helmetPlugin from './helmet.ts';

describe('helmet plugin', () => {
  it('adds security headers to responses', async () => {
    const app = Fastify({ logger: false });
    app.register(helmetPlugin);
    app.get('/test', async () => ({ ok: true }));
    await app.ready();

    const response = await app.inject({ method: 'GET', url: '/test' });

    expect(response.statusCode).toBe(200);
    expect(response.headers['x-frame-options']).toBeDefined();
    expect(response.headers['x-content-type-options']).toBeDefined();
    await app.close();
  });
});
