# Opc-Base

Opc-Base is an npm package that provides authentication, toast notification, injecting logic into opc components like `opc-nav`, drawer components etc.

## Getting Started

Copy the `config.example.json` fil in `dev folder`, rename it as `config.json` and provide the configuration values needed to load the variables.

### Installation

- ```sh
    npm install
  ```

### Development Setup

To start the live build with rollup

- ```sh
   npm run build:watch
  ```

To start the development server

- ```sh
   npm run dev
  ```

## Docs

1. [opc-base](https://github.com/1-Platform/one-platform/tree/master/packages/opc-base/docs/opc-base.md)
2. [opc-provider](https://github.com/1-Platform/one-platform/tree/master/packages/opc-base/docs/opc-provider.md)

## Available Scripts

In the project directory, you can run:

### `npm run dev`

To start the development server. Server will be available in `localhost:5000/dev`

### `npm test`

Runs the e2e test cases with jest

### `npm run build`

Generates build in production mode. Build will be available in `dist` directory.

### `npm run build:watch`

To watch for any change in source code and run the build again

## Contributors

👤 **Akhil Mohan** ([@akhilmhdh](https://github.com/akhilmhdh))
