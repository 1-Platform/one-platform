import path from "path";
import dts from "rollup-plugin-dts";

import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";
import minifyHTML from "rollup-plugin-minify-html-literals";
import copy from "rollup-plugin-copy";
import commonjs from "@rollup/plugin-commonjs";
import replace from "rollup-plugin-replace";
import image from "@rollup/plugin-image";

const production = !process.env.ROLLUP_WATCH;

// Static assets will vary depending on the application
const copyConfig = {
  targets: [],
};

const generalPlugins = [
  typescript(),
  minifyHTML(),
  copy(copyConfig),
  image(),
  resolve({ browser: true }),
  commonjs(),
  replace({
    "process.env.NODE_ENV": JSON.stringify("development"),
  }),
  production && terser(),
];

const opcBaseExternalModule = path.resolve(
  __dirname,
  "src/opc-base/opc-base.ts"
);

const opcProviderBundle = [
  {
    input: "src/opc-provider/opc-provider.ts",
    external: [opcBaseExternalModule],
    output: [
      {
        file: "./dist/umd/opc-provider.js",
        name: "opcProvider",
        format: "umd",
        sourcemap: true,
        globals: {
          [opcBaseExternalModule]: "opcBase",
        },
      },
    ],
    plugins: generalPlugins,
  },
  {
    input: "src/opc-provider/opc-provider.ts",
    external: [opcBaseExternalModule],
    output: [
      {
        file: "./dist/cjs/opc-provider.js",
        format: "cjs",
        sourcemap: true,
        paths: {
          [opcBaseExternalModule]: "./opc-base.js",
        },
      },
      {
        file: "./dist/opc-provider.js",
        format: "es",
        sourcemap: true,
        paths: {
          [opcBaseExternalModule]: "./opc-base.js",
        },
      },
    ],
    plugins: generalPlugins,
  },
];

const opcBaseBundle = [
  {
    input: "src/opc-base/opc-base.ts",
    output: [
      {
        file: "dist/umd/opc-base.js",
        sourcemap: true,
        format: "umd",
        name: "opcBase",
        exports: "auto",
      },
    ],
    plugins: generalPlugins,
  },
  {
    input: "src/opc-base/opc-base.ts",
    output: [
      {
        file: "dist/cjs/opc-base.js",
        sourcemap: true,
        format: "cjs",
      },
      {
        file: "dist/opc-base.js",
        sourcemap: true,
        format: "es",
      },
    ],
    plugins: generalPlugins,
  },
  {
    input: ["src/opc-provider/opc-provider.ts", "src/opc-base/opc-base.ts"],
    plugins: [dts()],
    output: {
      dir: "./dist",
      format: "es",
    },
  },
];

export default [...opcBaseBundle, ...opcProviderBundle];
