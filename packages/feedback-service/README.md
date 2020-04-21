Feedback Microservice
=================================================

One platform's server-side Feedback GraphQL microservice. This microservice will allow us to talk to feedback database and can perform operation like  addfeedback,updatefeedback,deletefeedback,listfeedback.

### Switch the working directory into `cd feedback-service`.

  Copy Certificates
  ------------
  1.  Copy the SSL paths to the `.env` file of `feedback` microservice.

  Start Microservice:
  ------------
  1.  Run `npm build:dev` to generate a build for dev env and `npm build` for production build.
  2.  Run `npm start:dev` to run your microservice for dev env and `npm start` for production env.


  Testing:
  ------------
  1.  Run `npm test` to run default tests.
