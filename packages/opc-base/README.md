# Opc-Base

Opc-Base is an npm package that provides authentication, toast notification, injecting logic into opc components like `opc-nav`, drawer components etc.

## Getting Started

Copy the `config.example.js` file in `dev folder`, rename it as `config.js` and provide the configuration values needed to load the variables.

For testing es module copy the `config.es.example.js` file in `dev folder`, rename it as `config.es.js` and provide the configuration values needed to load the variables.

### Installation

```sh
    npm install
```

### Development Setup

To start the live build with rollup

```sh
   npm run build:watch
```

To start the development server

```sh
   npm run dev
```

## Docs

1. [opc-base](https://github.com/1-Platform/one-platform/tree/master/packages/opc-base/docs/opc-base.md)
2. [opc-provider](https://github.com/1-Platform/one-platform/tree/master/packages/opc-base/docs/opc-provider.md)

## Build

This projects uses typescript with rollup for bundling

To build the project:

```bash
npm run build
```

To watch for changes and rebuild the files:

```bash
npm run build:watch
```

Inorder to preview the changes you made the project uses web [@web-dev-server](https://modern-web.dev/docs/dev-server/overview/):

```bash
npm run dev
```

## Testing

Testing is done using [@web/test-runner](https://modern-web.dev/docs/test-runner/overview/) and [@open-wc/testing](https://open-wc.org/docs/testing/testing-package/). Remember to build the package as some test are done using build file due to dependency import issues.

To run test:

```bash
npm run test
```

For local testing during development

```bash
npm run test:watch
```

## Contributors

👤 **Akhil Mohan** ([@akhilmhdh](https://github.com/akhilmhdh))
