import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import compress from '@fastify/compress';
import middie from '@fastify/middie';
import staticFiles from '@fastify/static';
import Fastify from 'fastify';
import type { ViteDevServer } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const isProduction = process.env['NODE_ENV'] === 'production';
const port = Number(process.env['PORT'] ?? 5173);
const base = process.env['BASE'] ?? '/';

/**
 * Resolves the project root directory.
 *
 * In development, `__dirname` is `<project>/src`, so root is one level up.
 * In production, `__dirname` is `<project>/dist`, so root is also one level up.
 */
const root = path.resolve(__dirname, '..');

console.log(`Starting server in ${isProduction ? 'production' : 'development'} mode...`);

/** Cached production template */
const templateHtml = isProduction
  ? await fs.readFile(path.resolve(__dirname, 'client/index.html'), 'utf8')
  : '';

/**
 * Starts the Fastify server with Vite SSR middleware integration.
 *
 * In development mode, Vite runs in middleware mode with HMR support and
 * modules are loaded on-demand via `ssrLoadModule`. In production, the
 * pre-built client and server bundles are served directly.
 *
 * @throws When the server fails to start or listen on the configured port.
 */
async function createServer(): Promise<void> {
  const app = Fastify({ logger: { level: 'error' } });

  let vite: ViteDevServer | undefined;

  if (isProduction) {
    await app.register(compress);
    await app.register(staticFiles, {
      root: path.resolve(__dirname, 'client'),
      prefix: base,
      index: false,
      decorateReply: false,
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    vite = await createViteServer({
      root,
      server: { middlewareMode: true },
      appType: 'custom',
      base,
    });

    await app.register(middie);
    app.use(vite.middlewares);
  }

  app.get('/portal', async (request, reply) => {
    try {
      const url = request.url.replace(base, '');

      let template: string;
      let render: (url: string) => { html: string; head?: string };

      if (isProduction) {
        template = templateHtml;
        const ssrPath = path.resolve(__dirname, 'server/entry-server.js');
        const { render: prodRender } = await import(/* @vite-ignore */ ssrPath);
        render = prodRender as typeof render;
      } else {
        template = await fs.readFile(path.resolve(root, 'index.html'), 'utf8');
        template = await vite!.transformIndexHtml(url, template);
        const { render: devRender } = await vite!.ssrLoadModule('/src/frontend/entry-server.tsx');
        render = devRender as typeof render;
      }

      const rendered = render(url);

      const html = template
        .replace('<!--app-head-->', rendered.head ?? '')
        .replace('<!--app-html-->', rendered.html);

      await reply.status(200).header('Content-Type', 'text/html').send(html);
    } catch (error) {
      if (error instanceof Error) {
        vite?.ssrFixStacktrace(error);
        console.error(error.stack);
        await reply.status(500).send(error.stack);
      } else {
        await reply.status(500).send('Internal Server Error');
      }
    }
  });

  await app.listen({ port, host: '0.0.0.0' });
  console.log(`Server started at http://localhost:${port}`);
}

await createServer();
