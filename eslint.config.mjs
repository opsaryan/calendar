import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import prettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
  { ignores: ['**/dist', '**/coverage', '**/node_modules', '**/.turbo'] },
  js.configs.recommended,
  { files: ['apps/api/**/*.js'], languageOptions: { globals: globals.node } },
  {
    files: ['apps/web/**/*.{js,jsx}'],
    plugins: { react, 'react-hooks': reactHooks },
    languageOptions: { globals: globals.browser, parserOptions: { ecmaFeatures: { jsx: true } } },
    settings: { react: { version: 'detect' } },
    rules: {
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      'react/prop-types': 'off',
    },
  },
  {
    files: ['apps/web/tests/**', 'apps/web/jest.setup.js'],
    languageOptions: { globals: { ...globals.jest, ...globals.node } },
  },
  { files: ['apps/web/tests/mocks/**'], languageOptions: { sourceType: 'commonjs' } },
  { files: ['**/*.cjs'], languageOptions: { sourceType: 'commonjs', globals: globals.node } },
  prettierRecommended,
];
