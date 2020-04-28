Home Microservice
=================================================

The Home SPA needs a backend API Service to fetch the microservice details and the Apps in spotlight list + videos. This microservice would solve that problem
by storing all such information. 

Switch to the working directory
------------

 `cd home-service`.

Copy Certificates
------------

  1. Copy the SSL paths to the `.env` file of `home` microservice.

Start Microservice
------------

  1. Run `npm build:dev` to generate a build for dev env and `npm build` for production build.
  2. Run `npm start:dev` to run your microservice for dev env and `npm start` for production env.

Testing
------------

  1. Run `npm test` to run default tests.
