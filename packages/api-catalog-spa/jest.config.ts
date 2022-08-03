export default {
  moduleNameMapper: {
    '\\.(css|less|scss)$': 'identity-obj-proxy',
    '^.+\\.svg$': 'jest-svg-transformer',
  },
  moduleDirectories: ['node_modules', 'src'],
  testEnvironment: '@happy-dom/jest-environment',
  extensionsToTreatAsEsm: ['.ts'],
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  transformIgnorePatterns: ['./node_modules/(?!dayjs/esm)'],
  preset: 'ts-jest/presets/default-esm',
  transform: {
    '^.+\\.(ts|tsx)?$': 'ts-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
};
