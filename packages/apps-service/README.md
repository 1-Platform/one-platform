# Apps Microservice

Apps Microservice provides the essential GraphQL APIs required for the Developer Console. It provides graphql queries for creating and managing apps.

## Features

- Allows creation of apps/projects
- Allows configuration of databases (Requires a couchdb instance)

## Local Development

### 1. Switch to the working directory

1. Switch to the working directory `cd apps-service`
2. Copy the `.env.example` to the `.env`
3. Change the values as needed, keeping the unneeded values as undefined

### 2. Start Microservice

Run `npm start` to run your microservice for dev env

To build the microservice, use `npm run build`.

## Using docker-compose (Recommended)

1. Follow the first 2 steps from above
2. Then execute the following command to start a standalone instance of `apps-service`

   ```bash
   docker-compose up -d apps-service
   ```

   **Note:** Some features of the App Service might not work without the API Gateway.

3. To start the entire cluster of microservices, use the following command

   ```bash
   docker-compose up -d api-gateway
   ```

## Runnninng Tests

```bash
npm test
```

## Contributors:

👤 **Mayur Deshmukh** [@deshmukhmayur](https://github.com/deshmukhmayur)
