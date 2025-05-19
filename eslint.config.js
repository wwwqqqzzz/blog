// @ts-check
/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:tailwindcss/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react', 'tailwindcss', '@stylistic'],
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  ignorePatterns: [
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
  rules: {
    // 关闭所有可能导致构建失败的规则
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-require-imports': 'off',
    '@typescript-eslint/no-empty-object-type': 'off',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/display-name': 'off',
    'no-unused-vars': 'off',
  },
};
