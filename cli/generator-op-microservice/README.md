One Platform Microservices Generator
========================================

One platform's server-side microservice genrerator with GraphQL and REST support.

Installation Instructions:
--------------------------

```
npm run cli-microservice
```

Usage:
------

1.  Run this generator inside your /packages directory_
2.  Enter the name of your microservice
3.  Choose whether you're building a microservice using REST or GraphQL.
4.  Choose if you need MongoDB support
5.  Enter the name of the author
6.  Enter the email of the author
7.  If you selected GraphQL, a directory will be created with &lt;microservice-name&gt;-service and for REST it will be &lt;microservice-name&gt;-integration

After Steps:
------------

1.  cd into your microservice directory
2.  Run `npm test` to run default tests
3.  Run `npm build:dev` to generate a build for dev env and `npm build` for production build
4.  Run `npm start:dev` to run your microservice for dev env and `npm start` for production env 