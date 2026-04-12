import Fastify from 'fastify';
import { describe, it, expect } from 'vitest';

import redisPlugin from './redis.ts';

describe('redis plugin', () => {
  it('is a no-op and does not decorate fastify.redis when REDIS_HOST is not set', async () => {
    const app = Fastify({ logger: false });
    app.register(redisPlugin);
    await app.ready();

    expect(app.hasDecorator('redis')).toBe(false);
    await app.close();
  });
});
