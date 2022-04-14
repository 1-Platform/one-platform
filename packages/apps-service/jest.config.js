/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  coverageDirectory: './coverage',
  testMatch: [ '<rootDir>/src/**/*.spec.ts' ],
  verbose: true,
};
