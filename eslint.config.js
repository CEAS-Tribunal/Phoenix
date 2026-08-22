import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import boundaries from 'eslint-plugin-boundaries'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
  },
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: { boundaries },
    settings: {
      'import/resolver': {
        typescript: { project: './tsconfig.app.json' },
      },
      'boundaries/elements': [
        { type: 'app', pattern: 'src/app', mode: 'folder' },
        { type: 'shared', pattern: 'src/shared', mode: 'folder' },
        { type: 'feature', pattern: 'src/features/*', mode: 'folder', capture: ['feature'] },
      ],
      'boundaries/ignore': ['src/**/*.d.ts', 'src/vite-env.d.ts'],
    },
    rules: {
      // Imports between files of the same element (e.g. within one feature) are
      // ignored by default; only cross-element dependencies are checked.
      'boundaries/dependencies': [
        'error',
        {
          default: 'disallow',
          rules: [
            // app (composition root) may use shared and other app files freely,
            // and consume features only through their public API (index.ts).
            { from: { type: 'app' }, allow: { to: { type: ['app', 'shared'] } } },
            {
              from: { type: 'app' },
              allow: { to: { type: 'feature', internalPath: 'index.ts' } },
            },
            // features may use shared freely and consume other features only via index.ts.
            { from: { type: 'feature' }, allow: { to: { type: 'shared' } } },
            {
              from: { type: 'feature' },
              allow: { to: { type: 'feature', internalPath: 'index.ts' } },
            },
            // shared may depend only on shared (no features, no app).
            { from: { type: 'shared' }, allow: { to: { type: 'shared' } } },
          ],
        },
      ],
    },
  },
  {
    // Barrels intentionally re-export values + types + lazy route components.
    files: ['src/features/*/index.ts'],
    rules: {
      'react-refresh/only-export-components': 'off',
    },
  },
])
