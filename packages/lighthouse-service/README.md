Lighthouse Microservice
=================================================

One platform's Lighthouse Microservice enables to audit a web property with support of Lighthouse CI.

Switch to the working directory
------------

 `cd lighthouse-service`.

Copy Certificates
------------

  1. Copy the SSL paths to the `.env` file of `lighthouse` microservice.

Start Microservice
------------

  1. Run `npm build:dev` to generate a build for dev env and `npm build` for production build.
  2. Run `npm start` to run your microservice for dev env.

Testing
------------

  1. Run `npm test` to run default tests.
