import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

import config from '../../eslint.config.mjs';

export default defineConfig([
  ...config,
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      reactRefresh.configs.vite,
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
