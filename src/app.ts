import './otel.ts';

import path from 'node:path';
import { fileURLToPath } from 'node:url';

import autoload from '@fastify/autoload';
import type { JsonSchemaToTsProvider } from '@fastify/type-provider-json-schema-to-ts';
import Fastify from 'fastify';

import { SETTINGS } from './settings.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Registers all Fastify plugins from the `plugins/` directory.
 *
 * @param app - The Fastify instance.
 * @param opts - Additional options forwarded to each plugin.
 */
async function registerPlugins(app: ReturnType<typeof Fastify>, opts: Record<string, unknown>) {
  await app.register(autoload, {
    dir: path.join(__dirname, 'plugins'),
    options: { ...opts },
  });
}

/**
 * Registers all application modules from the `modules/` directory.
 *
 * Only files matching `*.module.ts` (or `*.module.js` in production) are loaded.
 *
 * @param app - The Fastify instance.
 * @param opts - Additional options forwarded to each module.
 */
async function registerModules(app: ReturnType<typeof Fastify>, opts: Record<string, unknown>) {
  await app.register(autoload, {
    dir: path.join(__dirname, 'modules'),
    maxDepth: 1,
    dirNameRoutePrefix: false,
    matchFilter: (path: string) => /\.module\.(ts|js|mjs|cjs)$/.test(path),
    options: { ...opts },
  });
}

/**
 * Creates and configures the Fastify application instance.
 *
 * Registers plugins via autoload from the `plugins/` directory and
 * modules via autoload from the `modules/` directory.
 *
 * @returns The configured Fastify instance.
 */
export async function createApp() {
  const app = Fastify({ logger: { level: 'error' } })
    .withTypeProvider<JsonSchemaToTsProvider>();

  await registerPlugins(app, {});
  await registerModules(app, {});

  return app;
}

/**
 * Starts the HTTP server.
 *
 * @throws When the server fails to bind to the configured port.
 */
async function start(): Promise<void> {
  const app = await createApp();
  await app.ready();
  const port = Number(SETTINGS.PORT);
  await app.listen({ port, host: '0.0.0.0' });
  console.log(`Server started at http://localhost:${port}`);
}

// CJS bundles do not support top-level await; wrap in an async IIFE instead.
// eslint-disable-next-line unicorn/prefer-top-level-await
void (async () => {
  await start();
})();


