<p align="center"><img src="https://avatars1.githubusercontent.com/u/58499608?s=100&v=4" alt="One Platform Logo"></p>

# One Platform

![Version](https://img.shields.io/badge/version-0.1.0-blue.svg?cacheSeconds=2592000)
[![Documentation](https://img.shields.io/badge/documentation-yes-brightgreen.svg)](https://github.com/1-Platform/one-platform#readme)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/1-Platform/one-platform/graphs/commit-activity)
[![License: MIT](https://img.shields.io/github/license/1-Platform/one-platform)](https://github.com/1-Platform/one-platform/blob/master/LICENSE)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/1-Platform/one-platform.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/1-Platform/one-platform/alerts/)

An integrated application hosting platform which allows you to host your SPAs. It also provides common services like

- Authentication and Authorization
- Notifications Framework
- Feedback Framework

### Prerequisites

- Docker [Download](https://www.docker.com/get-started)

## Installation

### Install node_modules for all the packages
#### PS: The below script also copies `.env.example` to `.env` for all the services
```sh
npm install
```

### Environment Config

Copy all the `.env.example` to `.env` and add the following fields

- For SPAs (packages ending with *-spa)
    1. Add API_URL and set the url to .env

- For services (packages ending with *-service)
    1. Add database path in DB_PATH
    2. Add database name in DB_NAME
    3. Add database username in DB_USER
    4. Add database password in DB_PASSWORD

#### Example
```properties
## Database
DB_PATH=localhost
DB_NAME=platform
DB_USER=admin
DB_PASSWORD=admin
```

## Using docker-compose for local development

To start the local environment setup using docker-compose, use the following cli command from the root of this project:

```sh
docker-compose up $service_name
```

This will start the service along with any dependent services/databases required for the service (for eg. mongo).

_Note:_ The service name should match the service labels given the the [docker-compose.yml](./docker-compose.yml) in the root directory.

### Personal MongoDB instance using Docker Compose

You can also use docker-compose as a personal MongoDB instance. Just uncomment the ports in the [docker-compose.yml](./docker-compose.yml) file.

```yml
services:
  ...
  mongo:
    ...
    ports:
      - <local_port>:27017
```

You can replace the local port with any available port on your machine. I would recommend to not use the same `27017` port for your local, as that might cause conflicts with your local installation of MongoDB.

After that, just start the service:

```sh
docker-compose up mongo
```

This will start a MongoDB container instance, which can be access using localhost via the port mentioned in the docker-compose.

## Run tests

```sh
npm run test
```

## Deployments

***Note:*** `spashiprc` needs to be pre-configured on your system prior to using this script. Please check [SPAship documentation](https://spaship.io) to learn how to set this up correctly.

### Usage

You can use the deployment scipt for deploying any SPA to One Platform:

```sh
npm run deploy <PackageType> <PackageName> <PackagePath> <DeploymentEnv> <RefValue>
```

Deployment parameters:

1. `PackageType`: Based on the type of package, the value can either be `spa` or `service`.

2. `PackageName`: Name of the package directory. The expected directory naming convention is `package name` - `spa/service`. Examples: `foo-spa`, `bar-spa`.

3. `PackagePath`: Route to which the package needs to be deployed. Examples:  `/`, `/foo`, `/bar`, `/foo/bar`.

4. `DeploymentEnv`: The environment to which the package needs to be deployed. The value of this parameter needs to correspond with the name of an environment entry in your `.spashiprc` file. Examples: `qa`, `stage`, `opqa`, `opstage`.

5. `RefValue`: The reference version for this package. Usually this corresponds to a version number, however, it can also correspond to a string value for a valid ref. Example: `0.1.0`

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

Feel free to check [issues page](https://github.com/1-Platform/one-platform/issues). You can also take a look at the [contributing guide](./CONTRIBUTING.md).

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

This project is [MIT](./LICENSE) licensed.
