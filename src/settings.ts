import { z } from 'zod';

export const settingsSchema = z.object({
  NODE_ENV: z
    .enum([ 'development', 'production', 'test' ])
    .default('development'),

  /**
   * HTTP server port.
   */
  PORT: z
    .string()
    .refine((val) => {
      const port = Number.parseInt(val, 10);
      return !Number.isNaN(port) && port > 0 && port < 65_536;
    }, {
      message: 'PORT must be a valid port number',
    })
    .default('3000'),

  /**
   * Redis hostname. When set, the Redis plugin is enabled.
   */
  REDIS_HOST: z.string().optional(),

  /**
   * Redis port number (default: 6379).
   */
  REDIS_PORT: z
    .string()
    .refine((val) => {
      const port = Number.parseInt(val, 10);
      return !Number.isNaN(port) && port > 0 && port < 65_536;
    }, {
      message: 'REDIS_PORT must be a valid port number',
    })
    .optional(),

  /**
   * Redis authentication password.
   */
  REDIS_PASSWORD: z.string().optional(),

  /**
   * Redis ACL username (Redis 6+).
   */
  REDIS_USERNAME: z.string().optional(),

  /**
   * IP family to use for the Redis connection: 4 (IPv4) or 6 (IPv6).
   */
  REDIS_FAMILY: z.enum([ '4', '6' ]).optional(),

  /**
   * Redis logical database index (0–15).
   */
  REDIS_DB: z
    .string()
    .refine((val) => {
      const db = Number.parseInt(val, 10);
      return !Number.isNaN(db) && db >= 0 && db <= 15;
    }, {
      message: 'REDIS_DB must be an integer between 0 and 15',
    })
    .optional(),

  /**
   * Enable TLS for the Redis connection.
   */
  REDIS_TLS: z.enum([ 'true', 'false' ]).optional(),

  /**
   * Key prefix applied to all Redis keys.
   */
  REDIS_KEY_PREFIX: z.string().optional(),

  /**
   * Defer the Redis connection until the first command is issued.
   */
  REDIS_LAZY_CONNECT: z.enum([ 'true', 'false' ]).optional(),
});

export type Settings = z.infer<typeof settingsSchema>;

export const SETTINGS = settingsSchema.parse(process.env);
