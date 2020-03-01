One Platform <%= serviceClassName %> Microservice
=================================================

One platform's server-side <%= serviceClassName %> <% if (graphqlSupport) {%>GraphQL<%} else {%>REST<%}%> microservice.

Usage:
------------

1.  cd into <%= serviceName %>-<% if (graphqlSupport) {%>service<%} else {%>integration<%}%>
2.  Run `npm test` to run default tests
3.  Run `npm build:dev` to generate a build for dev env and `npm build` for production build
4.  Run `npm start:dev` to run your microservice for dev env and `npm start` for production env 