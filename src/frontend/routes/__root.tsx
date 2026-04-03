import { createRootRoute, Outlet } from '@tanstack/react-router';

import '../index.css';

/**
 * Root route that wraps all other routes with a shared layout.
 */
export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <Outlet />
  );
}
