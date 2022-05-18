/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  verbose: true,
  transform: {
    '^.+\\.(ts|tsx|js)$': 'ts-jest',
    '\\.(gql|graphql)$': 'jest-transform-graphql',
  },
};
