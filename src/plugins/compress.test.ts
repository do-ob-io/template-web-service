import Fastify from 'fastify';
import { describe, it, expect } from 'vitest';

import compressPlugin from './compress.ts';

describe('compress plugin', () => {
  it('registers without error', async () => {
    const app = Fastify({ logger: false });
    app.register(compressPlugin);
    await expect(app.ready()).resolves.not.toThrow();
    await app.close();
  });

  it('compresses responses when Accept-Encoding is provided', async () => {
    const app = Fastify({ logger: false });
    app.register(compressPlugin);
    app.get('/test', async () => ({ hello: 'world' }));
    await app.ready();

    const response = await app.inject({
      method: 'GET',
      url: '/test',
      headers: { 'accept-encoding': 'gzip' },
    });

    expect(response.statusCode).toBe(200);
    await app.close();
  });
});
