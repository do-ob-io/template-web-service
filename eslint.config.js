import { defineConfig, globalIgnores } from 'eslint/config';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import { configs as reactRefreshConfigs } from 'eslint-plugin-react-refresh';
import globals from 'globals';

import config from '../../eslint.config.mjs';

export default defineConfig([
  ...config,
  globalIgnores([ 'dist' ]),
  {
    files: [ '**/*.{ts,tsx}' ],
    extends: [
      reactRefreshConfigs.vite,
    ],
    settings: {
      'better-tailwindcss': {
        entryPoint: '../../globals.css',
      },
      'import-x/resolver-next': [
        createTypeScriptImportResolver({
          project: [
            'tsconfig.json',
          ],
          alwaysTryTypes: true,
        }),
      ],
      react: {
        version: 'detect',
      },
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
]);
