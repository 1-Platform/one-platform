<p align="center"><img src="https://avatars1.githubusercontent.com/u/58499608?s=100&v=4" alt="One Platform Logo"></p>

# One Platform

![Version](https://img.shields.io/badge/version-0.0.0-blue.svg?cacheSeconds=2592000)
[![Documentation](https://img.shields.io/badge/documentation-yes-brightgreen.svg)](https://github.com/1-Platform/one-platform#readme)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/1-Platform/one-platform/graphs/commit-activity)
[![License: MIT](https://img.shields.io/github/license/1-Platform/one-platform)](https://github.com/1-Platform/one-platform/blob/master/LICENSE)

An integrated application hosting platform which allows you to host your SPAs. It also provides common services like

- Authentication and Authorization
- Notifications Framework
- Feedback Framework

## Install

```bash
npm install
# OR
lerna bootstrap
```

## Using docker-compose for local development

To start the local environment setup using docker-compose, use the following cli command from the root of this project:

```bash
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

```bash
docker-compose up mongo
```

This will start a MongoDB container instance, which can be access using localhost via the port mentioned in the docker-compose.

## Run tests

```bash
npm run test
```

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

Feel free to check [issues page](https://github.com/1-Platform/one-platform/issues). You can also take a look at the [contributing guide](./CONTRIBUTING.md).

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

This project is [MIT](./LICENSE) licensed.
