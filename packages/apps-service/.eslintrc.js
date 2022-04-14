export default {
  root: true,
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: ['airbnb-base', 'airbnb-typescript/base', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  plugins: ['@typescript-eslint', 'prettier'],
  rules: {
    'no-underscore-dangle': 'off',
    'linebreak-style': ['error', 'unix'],
    quotes: [2, 'single', 'avoid-escape'],
  },
};
