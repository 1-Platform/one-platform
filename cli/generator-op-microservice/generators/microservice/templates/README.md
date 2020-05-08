<%= serviceClassName %> Microservice
=================================================

One platform's server-side <%= serviceClassName %> <% if (graphqlSupport) {%>GraphQL<%} else {%>REST<%}%> microservice.

Switch to the working directory
------------

 `cd <%= serviceName %>-<% if (graphqlSupport) {%>service<%} else {%>integration<%}%>`.

Copy Certificates
------------

  1. Copy the SSL paths to the `.env` file of `<%= serviceName %>` microservice.

Start Microservice
------------

  1. Run `npm build:dev` to generate a build for dev env and `npm build` for production build.
  2. Run `npm start` to run your microservice for dev env.

Testing
------------

  1. Run `npm test` to run default tests.
