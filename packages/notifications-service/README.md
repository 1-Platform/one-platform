# Notifications Service

Notifications Service provides the essential GraphQL APIs required for the Notifications Framework. It provides graphql queries for configuring notifications, triggering notifications, user subscriptions, etc.

## Local Development

### 1. Switch to the working directory

1. Copy the `.env.example` to the `.env`
2. Change the values as needed, remove the commented variables if not required

### 2. Start Microservice

Run `npm run dev` to run your microservice for dev env

To build the microservice, use `npm run build`.

## Using docker-compose (Recommended)

1. Follow the Step 1 from above
2. Then execute the following command to start a standalone instance of `notifications-service`

   ```bash
   docker-compose up -d notifications-service
   ```

   **Note:** Some features of the App Service might not work without the API Gateway.

3. To start all of microservices in this repository, use the following command

   ```bash
   docker-compose up -d api-gateway
   ```

## Runnninng Tests

```bash
npm test
```

## Contributors:

👤 **Mayur Deshmukh** [@deshmukhmayur](https://github.com/deshmukhmayur)


## Additional Resources:

- [Introducing GraphQL Federation to a Microservices Architecture](https://medium.com/sysco-labs/introducing-graphql-federation-to-a-microservices-architecture-742d0bdcaf07)
