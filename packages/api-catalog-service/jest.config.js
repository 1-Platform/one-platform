module.exports = {
  moduleFileExtensions: ['js', 'ts', 'tsx'],
  transform: {
    '^.+\\.(ts|tsx|js)$': 'ts-jest',
    '\\.(gql|graphql)$': 'jest-transform-graphql',
  },
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
  collectCoverage: true,
  testMatch: ['**/src/e2e/*.spec.(ts|tsx|js)'],
  testEnvironment: 'node',
  preset: 'ts-jest/presets/js-with-ts',
};
