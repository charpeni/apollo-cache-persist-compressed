// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import * as pluginImport from 'eslint-plugin-import';

export default tseslint.config(
  {
    ignores: ['**/node_modules', 'lib'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      import: { rules: pluginImport.rules },
    },
    rules: {
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
        },
      ],
    },
  },
);
