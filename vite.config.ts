import { defineConfig } from 'vite';

export default defineConfig({
  ssr: {
    noExternal: true,
  },
  build: {
    ssr: 'src/app.ts',
    ssrEmitAssets: true,
    minify: 'esbuild',
    outDir: 'dist',
    assetsDir: 'public',
    target: 'esnext',
    rollupOptions: {
      output: {
        entryFileNames: '[name].cjs',
        format: 'cjs',
        assetFileNames: '[name][extname]',
      },
    },
  },
  esbuild: {
    legalComments: 'none',
  },
});
