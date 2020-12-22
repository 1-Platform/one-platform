# Notifications Microservice

Notifications Microservice provides the essential GraphQL APIs required for the Notifications Framework. It provides graphql queries for configuring notifications, triggering notifications, listening for notifications, etc.

## Local Development

### 1. Switch to the working directory

1. Switch to the working directory `cd home-service`
2. Copy the `.env.example` to the `.env`
3. Change the values as needed, keeping the unneeded values as undefined

### 2. Start Microservice

1. Run `npm build:dev` to generate a build for dev env and `npm build` for production build
2. Run `npm start` to run your microservice for dev env

## Using docker-compose (Recommended)

1. Follow the first 2 steps from above
2. Then execute the following command to start a standalone instance of `notifications-service`

   ```bash
   docker-compose up -d notifications-service
   ```

3. To start the entire cluster of microservices, use the following command

   ```bash
   docker-compose up -d api-gateway
   ```

## Runnninng Tests

```bash
npm test
```

## Contributors:

👤 **Diwanshi Pandey** [@diwanshi](https://github.com/diwanshi)
👤 **Mayur Deshmukh** [@deshmukhmayur](https://github.com/deshmukhmayur)
