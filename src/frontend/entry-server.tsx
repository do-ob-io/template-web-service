import { createMemoryHistory, RouterProvider  } from '@tanstack/react-router';
import { renderToString } from 'react-dom/server';

import { createRouter } from './router.tsx';

/**
 * Renders the React application with TanStack Router to an HTML string for SSR.
 *
 * @param url - The request URL to match against the route tree.
 * @returns An object containing the rendered HTML string.
 */
export async function render(url: string): Promise<{ html: string }> {
  const router = createRouter();

  const memoryHistory = createMemoryHistory({ initialEntries: [ url ] });
  router.update({ history: memoryHistory });

  await router.load();

  const html = renderToString(
    <RouterProvider router={router} />,
  );

  return { html };
}
