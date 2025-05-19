// @ts-check
import stylistic from '@stylistic/eslint-plugin';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import tailwindcssPlugin from 'eslint-plugin-tailwindcss';

export default [
  {
    ignores: [
      'build/**',
      '.docusaurus/**',
      'node_modules/**',
      'static/js/disable-webpack-overlay.js',
      'static/js/telegram-notify.js',
      'src/plugins/**',
      'src/webpack.client.js',
      'webpack.config.js',
      'src/components/YourComponent.tsx',
      'src/Root.tsx',
      'src/theme/Layout.tsx',
      'src/theme/Root.tsx',
      'src/utils/dev-proxy.ts',
    ],
  },
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
    plugins: {
      '@stylistic': stylistic,
      'react': reactPlugin,
      'tailwindcss': tailwindcssPlugin,
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      // 放宽规则，允许更多警告
      '@typescript-eslint/no-unused-vars': 'warn',
      '@stylistic/semi': 'warn',
      '@stylistic/comma-dangle': 'warn',
      '@stylistic/operator-linebreak': 'warn',
      '@stylistic/indent-binary-ops': 'warn',
      '@stylistic/space-before-function-paren': 'warn',
      '@stylistic/brace-style': 'warn',
      '@stylistic/arrow-parens': 'warn',
      '@stylistic/member-delimiter-style': 'warn',
      '@stylistic/no-trailing-spaces': 'warn',
      '@stylistic/eol-last': 'warn',
    },
  },
];
