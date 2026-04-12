import Fastify from 'fastify';
import { describe, it, expect } from 'vitest';

import errorHandlerPlugin from './error-handler.ts';

describe('error-handler plugin', () => {
  it('returns a structured JSON body with statusCode 500 for an unhandled error', async () => {
    const app = Fastify({ logger: false });
    app.register(errorHandlerPlugin);
    app.get('/boom', async () => {
      throw new Error('something went wrong');
    });
    await app.ready();

    const response = await app.inject({ method: 'GET', url: '/boom' });
    const body = response.json<{ statusCode: number; error: string; message: string }>();

    expect(response.statusCode).toBe(500);
    expect(body.statusCode).toBe(500);
    expect(body.message).toBe('something went wrong');
    expect(body.error).toBeDefined();
    await app.close();
  });

  it('preserves the statusCode from a FastifyError', async () => {
    const app = Fastify({ logger: false });
    app.register(errorHandlerPlugin);
    app.get('/not-found', async () => {
      const err = new Error('not here') as Error & { statusCode: number };
      err.statusCode = 404;
      throw err;
    });
    await app.ready();

    const response = await app.inject({ method: 'GET', url: '/not-found' });
    const body = response.json<{ statusCode: number }>();

    expect(response.statusCode).toBe(404);
    expect(body.statusCode).toBe(404);
    await app.close();
  });
});
