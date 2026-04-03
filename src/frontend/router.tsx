import { createRouter as createTanStackRouter } from '@tanstack/react-router';

import { routeTree } from './route-tree.gen.js';

/**
 * Creates a new TanStack Router instance with the file-based route tree.
 *
 * @returns A configured TanStack Router instance.
 */
export function createRouter() {
  return createTanStackRouter({ routeTree });
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
