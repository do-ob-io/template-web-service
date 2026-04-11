import redis from '@fastify/redis';
import type { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

import { SETTINGS } from '../settings.ts';

/**
 * Registers the Redis client plugin when `REDIS_HOST` is configured.
 *
 * All connection options are driven by `SETTINGS` (environment variables).
 * When `REDIS_HOST` is not set, this plugin is a no-op and `fastify.redis`
 * will not be decorated.
 *
 * @param app - The Fastify instance to register Redis on.
 */
async function redisPlugin(app: FastifyInstance): Promise<void> {
  if (!SETTINGS.REDIS_HOST) {
    return;
  }

  await app.register(redis, {
    host: SETTINGS.REDIS_HOST,
    ...(SETTINGS.REDIS_PORT !== undefined && {
      port: Number.parseInt(SETTINGS.REDIS_PORT, 10),
    }),
    ...(SETTINGS.REDIS_PASSWORD !== undefined && {
      password: SETTINGS.REDIS_PASSWORD,
    }),
    ...(SETTINGS.REDIS_USERNAME !== undefined && {
      username: SETTINGS.REDIS_USERNAME,
    }),
    ...(SETTINGS.REDIS_FAMILY !== undefined && {
      family: Number.parseInt(SETTINGS.REDIS_FAMILY, 10) as 4 | 6,
    }),
    ...(SETTINGS.REDIS_DB !== undefined && {
      db: Number.parseInt(SETTINGS.REDIS_DB, 10),
    }),
    ...(SETTINGS.REDIS_TLS === 'true' && {
      tls: {},
    }),
    ...(SETTINGS.REDIS_KEY_PREFIX !== undefined && {
      keyPrefix: SETTINGS.REDIS_KEY_PREFIX,
    }),
    ...(SETTINGS.REDIS_LAZY_CONNECT !== undefined && {
      lazyConnect: SETTINGS.REDIS_LAZY_CONNECT === 'true',
    }),
  });
}

export default fp(redisPlugin, { name: 'redis' });
