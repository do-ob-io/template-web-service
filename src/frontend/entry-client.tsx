import { RouterProvider } from '@tanstack/react-router';
import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';

import './index.css';
import { createRouter } from './router.tsx';

const router = createRouter();

hydrateRoot(
  document.querySelector('#root')!,
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
