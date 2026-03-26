import { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';

import App from './app.tsx';

/**
 * Renders the React application to an HTML string for server-side rendering.
 *
 * @param _url - The request URL (reserved for future use with routing).
 * @returns An object containing the rendered HTML string.
 */
export function render(_url: string): { html: string } {
  const html = renderToString(
    <StrictMode>
      <App />
    </StrictMode>,
  );
  return { html };
}
