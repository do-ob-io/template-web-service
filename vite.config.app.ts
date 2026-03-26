import { defineConfig } from 'vite';

/**
 * Vite configuration for building the Fastify application.
 *
 * Bundles `src/app.ts` as an SSR entry with esbuild minification
 * and all dependencies inlined (no externals).
 */
export default defineConfig({
  build: {
    ssr: 'src/app.ts',
    outDir: 'dist',
    minify: 'esbuild',
    emptyOutDir: false,
  },
  ssr: {
    noExternal: true,
  },
});
