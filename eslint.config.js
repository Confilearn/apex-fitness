import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';

/*
  The a11y rules are the point of this config, not a nicety. Two whole classes
  of bug shipped in this codebase — six <button>s with no handler, and icon-only
  controls with no accessible name — and both are things a linter catches for
  free on every save.
*/
export default [
  { ignores: ['dist/**', 'node_modules/**', 'media-src/**'] },

  js.configs.recommended,

  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: { ...globals.browser },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: { react: { version: 'detect' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
    },
    rules: {
      ...react.configs.flat.recommended.rules,
      ...react.configs.flat['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.flatConfigs.recommended.rules,

      'react/prop-types': 'off', // no PropTypes in this codebase by choice

      // The exact defects found in the audit.
      'jsx-a11y/control-has-associated-label': 'error',
      'jsx-a11y/no-static-element-interactions': 'error',
      'jsx-a11y/click-events-have-key-events': 'error',

      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      eqeqeq: ['error', 'smart'],
    },
  },

  // Vercel serverless functions run in Node, not the browser.
  {
    files: ['api/**/*.js', 'scripts/**/*.mjs', '*.config.js'],
    languageOptions: { globals: { ...globals.node } },
    rules: { 'no-console': 'off' },
  },

  // The smoke test is Node, but its page.evaluate() callbacks are serialised
  // and run inside the browser, so both global sets are legitimate here.
  {
    files: ['scripts/smoke.mjs'],
    languageOptions: { globals: { ...globals.node, ...globals.browser } },
  },
];
