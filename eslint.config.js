import { defineConfig, globalIgnores } from 'eslint/config';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import globals from 'globals';

import config from '../../eslint.config.mjs';

export default defineConfig([
  ...config,
  globalIgnores([ 'dist' ]),
  {
    files: [ '**/*.ts' ],
    settings: {
      'import-x/resolver-next': [
        createTypeScriptImportResolver({
          project: [ 'tsconfig.json' ],
          alwaysTryTypes: true,
        }),
      ],
    },
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.node,
    },
  },
]);
