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
});

export type Settings = z.infer<typeof settingsSchema>;

export const SETTINGS = settingsSchema.parse(process.env);
