# Feedback Microservice
=================================================

One platform's Feedback GraphQL microservice supports managing the feedback with the JIRA/Github/Gitlab.

## Local Development

### 1. Switch to the working directory

1. Switch to the working directory `cd feedback-service`
2. Copy the `.env.example` to the `.env`
3. Change the values as needed, keeping the unneeded values as undefined

### 2. Start Microservice

1. Run `npm build:dev` to generate a build for dev env and `npm build` for production build
2. Run `npm start` to run your microservice for dev env

## Using docker-compose (Recommended)

1. Follow the first 2 steps from above
2. Then execute the following command to start a standalone instance of `notificfeedbackations-service`

   ```bash
   docker-compose up -d feedback-service
   ```

3. To start the entire cluster of microservices, use the following command

   ```bash
   docker-compose up -d api-gateway
   ```

## Running Tests

```bash
npm test
```

## Contributors:

👤 **Rigin Oommen** [@riginoommen](https://github.com/riginoommen)
