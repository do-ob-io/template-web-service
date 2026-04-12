import Fastify from 'fastify';
import { describe, it, expect } from 'vitest';

import sensiblePlugin from './sensible.ts';

describe('sensible plugin', () => {
  it('decorates fastify with httpErrors', async () => {
    const app = Fastify({ logger: false });
    app.register(sensiblePlugin);
    await app.ready();

    expect(app.httpErrors).toBeDefined();
    await app.close();
  });

  it('adds the HttpError shared schema', async () => {
    const app = Fastify({ logger: false });
    app.register(sensiblePlugin);
    await app.ready();

    expect(app.getSchema('HttpError')).toBeDefined();
    await app.close();
  });
});
