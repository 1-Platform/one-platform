module.exports = {
  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js"
  ],
  "transform": {
    "^.+\\.(ts|tsx|js)$": "ts-jest"
      },
  "globals": {
    "ts-jest": {
      "tsConfig": "tsconfig.json"
    }
  },
  "collectCoverage": true,
  "testMatch": [
    "**/src/e2e/*.spec.(ts|tsx|js)"
  ],
  "testEnvironment": "node"
}

