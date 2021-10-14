module.exports = {
  root: true,
  env: {
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: ["airbnb-base", "airbnb-typescript/base"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 13,
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
  },
  plugins: ["@typescript-eslint"],
  rules: {
    "max-len": ["error", { code: 130 }],
  },
};
