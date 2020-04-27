API Gateway
=================================================

API Gateway handles all the tasks involved in accepting and processing up to hundreds of thousands of concurrent API calls, including traffic management, CORS support, authorization and access control, throttling, monitoring.

### Switch the working directory into `cd api-gateway-service`.

  Copy Certificates
  ------------
  1.  Copy the SSL paths to the `.env` file of `api-gateway` microservice.

  Start Microservice:
  ------------
  1.  Run `npm build:dev` to generate a build for dev env and `npm build` for production build.
  2.  Run `npm start:dev` to run your microservice for dev env and `npm start` for production env.

  Testing:
  ------------
  1.  Run `npm test` to run default tests.
