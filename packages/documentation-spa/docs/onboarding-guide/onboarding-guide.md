---
id: onboarding-guide
title: One Platform Onboarding Guide
sidebar_label: Onboarding Guide
slug: /onboarding-guide
---
* * * *


## **PURPOSE**
The purpose of this Guide is to help new developers to get started with One Platform. This will cover various aspects such as -  Overview of One Platform, Its Architecture, Services etc. So let’s get started. Happy Reading!!


## **OVERVIEW**
 One Platform is a single place solution for teams within Red Hat to deploy their applications, websites and Microservices. The Stakeholders can easily deploy their applications without even being bothered about building and managing the Infrastructure hussles.


## **ARCHITECTURE**
1. _Relationship between users, developers, and platform_
2. _Microservices, the core components, and integrations with internal tools and services_ 
* SPAship is deploying each SPA and microservice in the IT’s Managed Platform. 
* This lets the platform auto scale and the core services are able to call each other without being aware of where they are running. 



## **CORE SERVICES**
Along with Helper Functions that are directly injected in the browser window object when the OpNav is inserted into the DOM. So any SPA which has the OpNav included can use the provided features>


### **Authentication**
One platform has different strategies for authentication. At the Client-side, internal auth is supported (auth.redhat.com) and at the API gateway, JWT token from Internal auth. The API key is supported. SPAs are authenticated by default through SSI authentication support.

**Tools/Integrations:** [auth.redhat.com](https://auth.redhat.com/)

**OpAuthHelper** A Javascript object that provides some methods for getting the JWT Token, and   User Info.

**Available methods**
* onLogin(cb: (user) => void): void \
Calls the callback function when the user is successfully logged in. Can be used to check when the user has logged in, to handle any API calls that require authentication.
* isAuthenticated: boolean \
Can be used to check if the user is logged in or not.
* getUserInfo(): User | null \
Returns the user details if the user is logged in, else returns null.


### **SSI Components**

One Platform provides global components, including a Navigation bar, Feedback action button, etc. These are provided as pluggable Apache Server Side Includes (SSI) snippets, with flexibility for the developers to customize and use it with their own applications. 

**Tools/Integrations:** Web-components, Internal SSO for Authentication

**Using ssi-templates for local development with other apps**

1. Copy the `.env.example` file and rename it as `.env`. Add the values for the environment variables as expected.

    ```
    # Make a copy of the secrets.example.json
    mv ./ssi-service/.env.example ./ssi-service/.env

    # Edit the secrets file
    nano ./ssi-service/.env
    ```


2. Add the following import in the your html files (preferably in the `<body>` tag before any other application javascript code/script tags)

    ```
    <body>
      ...
      <!-- SSI Include Snippet -->
      <!--#include virtual="/.include/nav/default.html" -->
      <!-- Other javascript files/scripts →
    </body>
    ```


3. Mount your SPA build/dist as a volume in the docker-compose `ssi-templates` service. (Make sure this is a build/dist directory present).

    ```
    ...
    services:
    ssi-templates:
    ...
      volumes:
        - # …
     - ./packages/<spa-package>/dist/:/var/www/html/<spa-name>/
    ```


4. Start the docker-compose \
`docker-compose up -d httpd`

### User & Group


The simplest microservice is a wrapper over _Rover_ that uses LDAP to authorize users. The plan is to give away complete ownership control to developers so the platform can stay out of the authorization business. User-group microservice plays the role of the middleware which talks to the organization's user data store. This is primarily integrated with LDAP and Rover. Also, it manages a minimal data store for faster data processing. This data store is updated daily with sync scripts. Native/Non-native microservices/SPAs can benefit from this for managing the user information. **Tools/Integrations**: LDAP, Rover 


### Feedback

The goal of feedback microservice is to let users submit feedback in 3 easy steps i.e. Select_ App_, select _Experience_, and _Describe a problem_ to help developers and the Platform team (in case of core services) build context for better decisions. The feedback services integrated with the ticketing system (_Jira_ & _GitLab_) so developers can follow up with end-users and record satisfaction. This provides complete transparency as data is visible to all visitors and helps to increase the value of the applications. 

**Tools/Integrations:** Jira, GitLab, Github, SNOW(future), User Group microservice

**Feedback Microservice** - One platform's Feedback GraphQL microservice supports managing the feedback with the JIRA/Github/Gitlab.

**Local Development**
1. Switch to the working directory
2. Switch to the working directory cd feedback-service
3. Copy the .env.example to the .env
4. Change the values as needed, keeping the unneeded values as undefined.
5. Start Microservice
6. Run npm build:dev to generate a build for dev env and npm build for production build
7. Run npm start to run your microservice for dev env

**Using docker-compose (Recommended)**



1. Follow the first 2 steps from above
2. Then execute the following command to start a standalone instance of feedback-service
3. docker-compose up -d feedback-service
4. To start the entire cluster of microservices, use the following command \
docker-compose up -d api-gateway

**Running Tests**

```sh
npm test
```

### Notification

It is the core communication microservice of the platform for native(inbuilt) and non-native apps. It enables developers to select & configure the mode of communication for individual apps. The need for microservices to communicate with each other, many of which does not necessitate real-time communication, demanded the need of an engine that can help to notify the users of the event without bothering about the health and response of users. It is kept as  _lightweight_ to ensure a quick response. 

**Tools/Integrations:** Hydra, User Group microservice

**Notifications Microservice** - Notifications Microservice provides the essential GraphQL APIs required for the Notifications Framework. It provides graphql queries for configuring notifications, triggering notifications, listening for notifications, etc.

** Local Development**


    1. Switch to the working directory



1. Switch to the working directory cd home-service
2. Copy the `.env.example` to the `.env`
3. Change the values as needed, keeping the unneeded values as undefined
    * Start Microservice
4. Run `npm build:dev` to generate a build for dev env and `npm build` for production build
5. Run `npm start` to run your microservice for dev env

**Using docker-compose (Recommended)**
1. Follow the first 2 steps from above
2. Then execute the following command to start a standalone instance of notifications-service \
`docker-compose up -d notifications-service`
3. To start the entire cluster of microservices, use the following command \
`docker-compose up -d api-gateway`

**Running Tests**

  npm test

### Search
One Platform goal is to consolidate applications and make them searchable in real-time. It should be a single point of contact for end-users when they are looking for an app. The Search microservices would not only resolve app search problems however it would extend the search to app contents. This helps to design & develop an native app search. 

## **Tools/Integrations:** Search (_Solr_) platform, Hydra

**Search Microservice** - Search microservice is the one of the major pillars of One platform   which shows the result according to the search term. This microservice will provide the  functionality of searching, indexing and deletion of data from Apache Solr.

**Switch to the working directory**

cd search-service.

**Install Dependencies**

1. Execute npm install for installing node dependencies.

**Start Microservice**

1. Run npm build:dev to generate a build for dev env and npm build for production build.
2. Run npm start to run your microservice for dev env.

**Testing**

1. Run npm test to run default tests.

### **API Gateway**

The responsibility of the API gateway is to record “_which service is communicating, with whom, and is it allowed to do so_”. Access Control is implemented on top of the API Gateway which enables the authorization and permission model in the data flow. Also, it is a single source of truth for the entire one platform backend. Websocket support is also provided in the gateway. The supported authorization models are,


1. JWT Tokens from auth.redhat.com
2. API Key

**Tools/Integrations:** User Group microservice

API Gateway - API Gateway handles all the tasks involved in accepting and processing up to hundreds of thousands of concurrent API calls, including traffic management, CORS support, authorization and access control, throttling, monitoring.

**Local Development using docker-compose (recommended)**

1. Copy the .env.example to .env. Change/modify the variable values as required.
2. Change the URIs in config.json and add/remove the microservices as needed
3. Run the docker-compose service using docker-compose up api-gateway 

The above command will start all the dependent services from this project. (Make sure any external microservices added in step 2 are running and accessible)

_Note:_ Before starting the gateway, also make sure the microservices in this project are configured properly.

**Running Tests**

npm test

### **Database**

One Platform has been configured to use _MongoDB_ with and for native apps to save time, effort, and enhance response time. For example, unless the App is configured to use a ticketing system with feedback One Platform would store the feedback in a local database.  Developers are encouraged to use non-native databases to ease the portability.

### [CI/CD Pipeline steps](https://jamboard.google.com/d/1Dml55rVlVzUo0VxXLxXISt7jtK0K3AW3GWviNr2WwrY/viewer?f=1) to automate the workflow

1. Developer raises a PR on Master Branch

    1. (*)Run Build Tests and Unit tests
    2. (*)Code quality checks
    3. (!)Reviewer reviews the code manually.

1. PR is merged on Master

    4. (*)Build and deploy changes to QA
    5. (*)Run E2E Test cases
    6. (!)Manual QA Testing

2. On Successful QA Testing

    7. (!)Send a PR from Master to the specific Release branch (rc/app-name)
    8. (!)Reviewer does final checks

3. (!)Release PR is merged

    9. (*)Build and deploy to Stage

4. (!)Tag created from a Release branch

    10. (*)Build and deploy to Production
    11. (*)Run Lighthouse CI


#### [Quick deploying a One Platform SPAship Instance to MPaaS](https://docs.google.com/document/d/1P4uM1fjOXUq0Ni5fz1OZ2o1Hm1-f4ZT9WOLNof5vchg/edit#heading=h.jjv3mfsaqnxa)
#### [Steps for deploying a SPA to One Platform via SPAship](https://docs.google.com/document/d/18UkX3KtiC-tqm381qARBm0DSWjK0aMbQxfBya94QQ0U/edit#heading=h.rrt0yafrpwfb)


<table>
  <tr>
   <td>Author
   </td>
   <td>Date Modified
   </td>
   <td>Version
   </td>
   <td>Changelog
   </td>
  </tr>
  <tr>
   <td>Shruti Pandey
   </td>
   <td>14.08.2021
   </td>
   <td>v1.0
   </td>
   <td>Initial document
   </td>
  </tr>
  <tr>
   <td>Shruti Pandey
   </td>
   <td>16.08.2021
   </td>
   <td>v1.1
   </td>
   <td>Table of Contents added
   </td>
  </tr>
</table>
