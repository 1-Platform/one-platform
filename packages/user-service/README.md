# User Group Microservice

One platform's server-side User Group GraphQL microservice. This microservice enables us to talk to the user database and the third party user data sources like LDAP (Light Weight Directory Access Protocol). It also provides the endpoint to serve the api requests

## Switch to the working directory

`cd user-service`

Copy Certificates

---

1.  Copy the SSL paths to the `.env` file of `user` microservice.

Start Microservice:

---

1.  Run `npm build:dev` to generate a build for dev env and `npm build` for production build.
2.  Run `npm start` to run your microservice for dev env.

Testing:

---

1.  Run `npm test` to run default tests.
