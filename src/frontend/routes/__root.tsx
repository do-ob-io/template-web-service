import { createRootRoute, Outlet } from '@tanstack/react-router';

import '../index.css';

/**
 * Root route that wraps all other routes with a shared layout.
 */
export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootComponent() {
  return (
    <Outlet />
  );
}

function NotFoundComponent() {
  return (
    <div>
      <h1>404 Not Found</h1>
      <p>The page you are looking for does not exist.</p>
    </div>
  );
}
