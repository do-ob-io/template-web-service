import Fastify from 'fastify';
import { describe, it, expect } from 'vitest';

import swaggerPlugin from './swagger.ts';

describe('swagger plugin', () => {
  it('serves GET /openapi.json with a valid OpenAPI document', async () => {
    const app = Fastify({ logger: false });
    app.register(swaggerPlugin);
    await app.ready();

    const response = await app.inject({ method: 'GET', url: '/openapi.json' });
    const body = response.json<{ openapi: string; info: { title: string } }>();

    expect(response.statusCode).toBe(200);
    expect(body.openapi).toBe('3.0.0');
    expect(body.info.title).toBe('Template Web Service');
    await app.close();
  });
});
