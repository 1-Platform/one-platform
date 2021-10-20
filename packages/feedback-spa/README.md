# Feedback SPA

Feedback SPA provides the consolidated view of user experience which has shared to developer team. It consist of encapsulated view of bugs/feedback shared by the users. This provides a clear picture about the progress of the feedback and status.

#### Features Supported

- Exporting feedback.
- Filtered view of feedback.

## Project setup

1. `NodeJS >= v12.16.1` is required.

2. `yarn` is the package manager used.

### Setting environment variables

````
eg.
```sh
export VUE_APP_GRAPHQL_HTTP=<API endpoint of Feedback SPA>
export VUE_APP_OPCBASE_API_BASE_PATH=<API endpoint for opc-base library>
export VUE_APP_OPCBASE_SUBSCRIPTION_BASE_PATH=<subscription endpoint for opc-base library>
export VUE_APP_OPCBASE_KEYCLOAK_URL=<SSO Keycloak URL for auth>
export VUE_APP_OPCBASE_KEYCLOAK_CLIENT_ID=<SSO Keycload Real>
````

Set the environment variable before building/serving the app.

### Installation of dependencies

```sh
yarn install
```

### Compiles and hot-reloads for development

```sh
yarn serve
```

### Compiles and minifies for production

```sh
yarn build
```

### Run your unit tests

```sh
yarn test:unit
```

### Run your end-to-end tests

```sh
yarn test:e2e
```

### Lints and fixes files

```sh
yarn lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).

## Contributors:

👤 **Rigin Oommen** [@riginoommen](https://github.com/riginoommen)
