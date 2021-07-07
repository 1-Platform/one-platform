---
id: op-cli
title: One Platform CLI
sidebar_label: One Platform CLI
slug: /cli
---
* * *

## Contributors & Maintainers

1. Diwanshi Pandey - [dpandey@redhat.com](mailto:dpandey@redhat.com) - [diwanshi (Diwanshi Gadgil) · GitHub](https://github.com/diwanshi)
2. Rigin Oommen - [roommen@redhat.com](mailto:roommen@redhat.com) - [riginoommen (Rigin Oommen) · GitHub](https://github.com/riginoommen)

## License

[MIT](https://github.com/1-Platform/one-platform/blob/master/LICENSE)

## Getting Started

One Platform (OP) CLI generator which was built using yeoman which helps to bootstrap microservices. This project can be used to generate microservice on GraphQL and REST specifications. Yeoman is a generic scaffolding system allowing the creation of any kind of app. It allows for rapidly getting started on new projects and streamlines the maintenance of existing projects.

## Usage

### Introduction

One Platform CLI Generator will bootstrap a microservice which is compatible with NodeJS ecosystem.

### Supported Features

1. Pre-built API Configurations
2. Test Suite Setup
3. Build configuration with webpack
4. MongoDB database integration

#### Apps using this CLI

1. Notifications
2. Home
3. MoD handovers
4. Feedback
5. API Gateway
6. User SPA
7. Search

### Installation & Setup

#### Prerequisites

1. **NodeJS**  should be installed (*version>=**v10.15.3*)
2. **NPM** should be installed *(version>=**6.4.1**)*
3. Version control system required. Preferably **git**.

#### Steps

1. Clone the [repository](https://github.com/1-Platform/one-platform).

    ```sh
    git clone git@github.com:1-Platform/one-platform.git
    ```

2. Switch to the cloned repository

    ```sh
    cd one-platform
    ```

3. Install the dependencies.

    ```sh
   npm i
   ```

4. Trigger the microservice creation.

    ```sh
   npm run cli-microservice
    ```

5. Enter the basic details of the microservices in the CLI prompts
    1. Enter the name of microservice
    2. Select API type (GraphQL/REST) you require?
    3. If database integration needed opt in for it.
    4. Give the author details of microservice such as Name and Email.

        ```sh
        Your microservice name: mod
        Which type of API do you want to create? GraphQL
        Are you going to use MongoDB? Yes
        Author name Rigin Oommen
        Author Email riginoommen@gmail.com
        ```

    5. If you opted for GraphQL, a directory will be created with `<microservice-name>`-service and for REST it will be `<microservice-name>`-integration.

### Development and Debugging

#### Start

1. Run `npm start:dev` to run your microservice for dev env and npm start for production env.

#### Build

1. [Webpack](https://webpack.js.org) is used for the build system in the microservices.
2. Run `npm build:dev` to generate a build for development environment and `npm build` for production build.

#### Testing

1. For testing microservice with [supertest](https://www.npmjs.com/package/supertest) with the preconfigured settings.
2. Test related environment configurations are present in .test.env under the e2e folder.
3. Execute the command for testing.

     ```sh
    npm run test
    ```

## FAQs

* **Does this generator support other languages?**

    No this generator provides support only Javascript.
