# Welcome to home-spa 👋

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000)
[![Documentation](https://img.shields.io/badge/documentation-yes-brightgreen.svg)](https://github.com/1-Platform/one-platform#readme)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://github.com/1-Platform/one-platform/graphs/commit-activity)

Home SPA for One Platform

## Install

```sh
npm install
```

## Usage

### Development server

- Change .env.example to .env
- Add URL to API_URL in .env file

```sh
API_URL=https://example.com/graphql
SPASHIP_API_URL=https://example.com/api/deploy
SPASHIP_API_KEY=abcd-abcd-abcd-abcd
```

- Schema

```js
{
    name: 'Name/Title'
    description: 'Description of the entity,
    link: 'Link to entity'
    icon: 'Icon for the entity',
    colorScheme: 'In case of microservice entity',
    videoUrl: 'In caase of spa entity',

}
```

- Run development server

```sh
npm run start
```

### Build

```sh
npm run build
```

## Run tests

```sh
npm run build
npm run test
```

## 🤝 Contributors

👤 **Deepesh Nair** [@hybridx](https://github.com/hybridx)
