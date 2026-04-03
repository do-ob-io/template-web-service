import { TanStackRouterVite } from '@tanstack/router-vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    TanStackRouterVite({
      target: 'react',
      routesDirectory: './src/frontend/routes',
      generatedRouteTree: './src/frontend/route-tree.gen.ts',
      indexToken: 'page',
      routeFileIgnorePattern: '^_(?!_)',
      quoteStyle: 'single',
      semicolons: true,
    }),
  ],
});
