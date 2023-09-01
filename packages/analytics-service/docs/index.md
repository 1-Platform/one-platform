# Analytics Microservice

Analytics microservice is used for providing analytics api information for SPAs deployed in One Platform by connecting with Sentry and Pendo

## Features

1. Total rate timeline
2. Unique error rate timeline
3. Total count of errors on an interval
4. Total unique errors on an interval
5. Error outcome based timeline - (Accepted errors, invalid errors etc)
6. Api to connect analytics service with an existing project and an app or create a new one in one-platform set

## Local Development

### 1. Switch to the working directory

1. Switch to the working directory `cd analytics-service`
2. Copy the `.env.example` to the `.env`
3. Change the values as needed, keeping the unneeded values as undefined

### 2. Start Microservice

Install required modules by using `npm install`

Run `npm start` to run your microservice for dev env

To build the microservice, use `npm run build`.

## Using docker-compose (Recommended)

1. Follow the first 2 steps from above
2. Then execute the following command to start a standalone instance of `analytics-service`

   ```bash
   docker-compose up -d analytics-service
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

👤 **Akhil Mohan** [@akhilmhdh](https://github.com/akhilmhdh)
