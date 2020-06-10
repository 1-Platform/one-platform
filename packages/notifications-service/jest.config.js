module.exports = {
  moduleFileExtensions: [
    "ts",
    "tsx",
    "js"
  ],
  transform: {
    "^.+\\.(ts|tsx|js)$": "ts-jest"
    ,
    "\\.(gql|graphql)$": "jest-transform-graphql"
  },
  globals: {
    "ts-jest": {
      tsConfig: "tsconfig.json"
    }
  },
  collectCoverage: true,
  testMatch: [
    "**/src/__tests__/*.spec.(ts|tsx|js)"
  ],
  testEnvironment: "node"
};
