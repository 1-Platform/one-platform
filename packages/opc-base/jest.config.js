export default {
  preset: "ts-jest",
  runner: "jest-electron/runner",
  testEnvironment: "jest-electron/environment",
  setupFiles: ["./test/opc-provider.js"],
};
