import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';

import './index.css';
import App from './app.tsx';

hydrateRoot(
  document.querySelector('#root')!,
  <StrictMode>
    <App />
  </StrictMode>,
);
