import { esbuildPlugin } from "@web/dev-server-esbuild";
import { fromRollup } from "@web/dev-server-rollup";
import rollupCommonjs from "@rollup/plugin-commonjs";

const commonjs = fromRollup(rollupCommonjs);

export default {
  plugins: [
    esbuildPlugin({ ts: true, js: true, target: "auto" }),
    commonjs({
      include: [
        // the commonjs plugin is slow, list the required packages explicitly:
        "./node_modules/dayjs/**/*",
      ],
    }),
  ],
  files: ["src/**/*.test.ts"],
  nodeResolve: true,
  rootDir: ".",
  preserveSymlinks: true,
  testFramework: {
    // https://mochajs.org/api/mocha
    config: {
      ui: "tdd",
    },
  },
};
