import Fastify from 'fastify';
import { describe, it, expect } from 'vitest';

import corsPlugin from './cors.ts';

describe('cors plugin', () => {
  it('adds access-control-allow-origin header to responses', async () => {
    const app = Fastify({ logger: false });
    app.register(corsPlugin);
    app.get('/test', async () => ({ ok: true }));
    await app.ready();

    const response = await app.inject({
      method: 'GET',
      url: '/test',
      headers: { origin: 'http://example.com' },
    });

    expect(response.statusCode).toBe(200);
    expect(response.headers['access-control-allow-origin']).toBeDefined();
    await app.close();
  });

  it('responds to preflight OPTIONS requests', async () => {
    const app = Fastify({ logger: false });
    app.register(corsPlugin);
    app.get('/test', async () => ({ ok: true }));
    await app.ready();

    const response = await app.inject({
      method: 'OPTIONS',
      url: '/test',
      headers: {
        origin: 'http://example.com',
        'access-control-request-method': 'GET',
      },
    });

    expect(response.statusCode).toBe(204);
    await app.close();
  });
});
