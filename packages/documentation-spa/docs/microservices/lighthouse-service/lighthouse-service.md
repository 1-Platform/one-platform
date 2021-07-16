---
id: lighthouse-service
title: Lighthouse Service
sidebar_label: Lighthouse Service
slug: /microservices/lighthouse-service
---

## Developers

1. Akhil Mohan - [akmohan@redhat.com](mailto:akmohan@redhat.com) - [akhilmhdh (Akhil Mohan) · GitHub](https://github.com/akhilmhdh)
2. Rigin Oommen - [roommen@redhat.com](mailto:roommen@redhat.com) - [riginoommen (Rigin Oommen) · GitHub](https://github.com/riginoommen)

## Getting Started
Lighthouse microservice provides the ecosystem to perform the CI operations to test a website with [@lhci/ci](https://www.npmjs.com/package/@lhci/ci) also it consists of APIs which is integrated with [@lhci/server](https://www.npmjs.com/package/@lhci/server)

## Usage

### Introduction

Lighthouse microservice is built using NodeJS v14.16.0 which has mongodb integration as database support. This microservice serves as the backend for the Lighthouse SPA. This microservices consists of two parts

1. Audit Manager
    * Configurations associated with the CI environment.
2. Property Manager
    * Configurations associated with lighthouse dashboard.

### Supported Features

1. Audit a website with Lighthouse and upload the results to server.
2. APIs for the Lighthouse Server & Dashboard

### Quick Start Guide

#### Prerequisites

1. **NodeJS** should be installed (_version >= __v14.16.0__ )
2. **NPM** should be installed _(version >= __6.14.11__ )_
3. Version control system required. Preferably **git**.

#### Steps

1. Clone the [repository](https://github.com/1-Platform/one-platform).

```sh
git clone git@github.com:1-Platform/one-platform.git
```

2. Switch the working directory to the user microservice

```sh
cd one-platform/packages/lighthouse-service
```

3. Install the microservice dependencies.

```sh
npm i
```

### Start

1. Run npm start:dev to run your microservice for dev env and npm start for production env.
2. Navigate to port 8080 to see the microservice.

eg: http://localhost:8080/graphql

### Build

1. [Webpack](https://webpack.js.org/) is used for the build system in the microservices.
2. Run npm build:dev to generate a build for dev env and npm build for production build.

### Testing

1. For testing microservice with [supertest](https://www.npmjs.com/package/supertest) with the preconfigured settings.
2. Test related environment configurations are present in .test.env under the e2e folder.
3. Execute the command for testing.

```graphql
npm run test
```
## API References
In the GraphQL GET Operations are defined as Queries and POST/PUT/PATCH operations are defined as Mutations.

### Audit Manager

#### Queries
##### List all projects registered in lighthouse server,
- Operation Name - ListLHProjects
- Supported Query Variables - `serverBaseUrl`

```graphql
query ListLHProjects($serverBaseUrl: String) {
    listLHProjects(serverBaseUrl: $serverBaseUrl) {
        _id
        name
        slug
        externalUrl
        token
        baseBranch
        createdAt
        updatedAt
    }
}
```

##### Fetch lighthouse report from server.
- Operation Name - ListProjectLHReport
- Supported Query Variables - `serverBaseUrl`,`projectID`,`buildID`

```graphql
query ListProjectLHReport($serverBaseUrl: String, $projectID: String!, $buildID: String!) {
    listProjectLHReport(serverBaseUrl: $serverBaseUrl, projectID: $projectID, buildID: $buildID) {
        performance
        accessibility
        bestPractices
        seo
        pwa
    }
}
```

##### Fetch & Verify Build Token of a project.
- Operation Name - VerifyLHProjectDetails
- Supported Query Variables - `serverBaseUrl`,`buildToken`

```graphql
query VerifyLHProjectDetails($serverBaseUrl: String, $buildToken: String!) {
    verifyLHProjectDetails(serverBaseUrl: $serverBaseUrl, buildToken: $buildToken) {
        _id
        name
        slug
        externalUrl
        token
        baseBranch
        createdAt
        updatedAt
    }
}
```

##### Fetch Builds of the project by branch name and project id.
- Operation Name - ListLHProjectBuilds
- Supported Query Variables - `serverBaseUrl`,`projectID`, `branch`, `limit`

```graphql
query ListLHProjectBuilds($serverBaseUrl: String, $projectID: String!, $branch: String!, $limit: Int!) {
    listLHProjectBuilds(serverBaseUrl: $serverBaseUrl, projectID: $projectID, branch: $branch, limit: $limit) {
        id
        projectId
        branch
        runAt
        score {
            performance
            accessibility
            bestPractices
            seo
            pwa
        }
        createdAt
        updatedAt
    }
}
```

##### Fetch the branches of a project.
- Operation Name - ListLHProjectBranches
- Supported Query Variables - `serverBaseUrl`,`projectID`

```graphql
query ListLHProjectBranches($serverBaseUrl: String, $projectID: String!) {
    listLHProjectBranches(serverBaseUrl: $serverBaseUrl, projectID: $projectID) {
        branch
}
}
```

##### Fetch the scores of the tests executed with lighthouse microservice.
- Operation Name - ListLHScore
- Supported Query Variables - `auditId`

```graphql
query ListLHScore($auditId: String!) {
    listLHScore(auditId: $auditId) {
        performance
        accessibility
        bestPractices
        seo
        pwa
        }
}
```

#### Mutations
##### Audit the website
- Operation Name - AuditWebsite
- Required Mutation variables type - `LighthouseInput`

```graphql
mutation AuditWebsite($property: LighthouseInput) {
    auditWebsite(property: $property)
}
```
##### Upload the result to lighthouse server
- Operation Name - UploadLHReport
- Required Mutation variables type - `LighthouseInput`

```graphql
mutation UploadLHReport($property: LighthouseInput) {
    uploadLHReport(property: $property)
}
```

### Property Manager

#### Queries
##### List all properties for dashboard
- Operation Name - ListLHProperties
- Supported Query Variables - `limit`, `offset`, `search`,`user`

```graphql
query ListLHProperties($limit: Int, $offset: Int, $search: String, $user: String) {
    listLHProperties(limit: $limit, offset: $offset, search: $search, user: $user) {
        _id
        name
        description
        projectId
        apps {
            id
            name
            branch
        }
        createdBy {
            cn
            uid
            rhatUUID
            mail
        }
        createdOn
        updatedBy {
            cn
            uid
            rhatUUID
            mail
        }
        updatedOn
    }
}
```

##### List property by id
- Operation Name - GetLHPropertyById
- Supported Query Variables - `id`

```graphql
query GetLHPropertyById($id: ID!) {
    getLHPropertyById(id: $id) {
        _id
        name
        description
        projectId
        apps {
            id
            name
            branch
        }
        createdBy {
            cn
            uid
            rhatUUID
            mail
        }
        createdOn
        updatedBy {
            cn
            uid
            rhatUUID
            mail
        }
        updatedOn
    }
}
```

#### Mutations
##### Create new property in dashboard.
- Operation Name - CreateLHProperty
- Required Mutation variables type - `AddLHPropertyInput`

```graphql
mutation CreateLHProperty($property: AddLHPropertyInput!) {
    createLHProperty(property: $property) {
        _id
        name
        description
        projectId
        apps {
            id
            name
            branch
        }
        createdBy {
            cn
            uid
            rhatUUID
            mail
        }
        createdOn
        updatedBy {
            cn
            uid
            rhatUUID
            mail
        }
        updatedOn
    }
}
```

##### Update property in dashboard.
- Operation Name - UpdateLHProperty
- Required Mutation variables type - `UpdateLHPropertyInput`

```graphql
mutation UpdateLHProperty(id:ID! ,$data: UpdateLHPropertyInput) {
    updateLHProperty(id:$id, data: $data) {
        _id
        name
        description
        projectId
        apps {
            id
            name
            branch
        }
        createdBy {
            cn
            uid
            rhatUUID
            mail
        }
        createdOn
        updatedBy {
            cn
            uid
            rhatUUID
            mail
        }
        updatedOn
    }
}
```

##### Delete property in dashboard.
- Operation Name - DeleteProperty
- Required Mutation variables type - `id`

```graphql
mutation DeleteLHProperty(id:ID!) {
    deleteLHProperty(id:$id) {
        _id
        name
    }
}
```

##### Create new mapping of app in property.
- Operation Name - CreateLHApp
- Required Mutation variables type - `propertyId`,`AddLHPropertyAppInput`

```graphql
mutation CreateLHApp($propertyId: ID!, appData: AddLHPropertyAppInput!) {
    createLHApp(propertyId: $propertyId, appData: $appData) {
        _id
        name
        description
        projectId
        apps {
            id
            name
            branch
        }
        createdBy {
            cn
            uid
            rhatUUID
            mail
        }
        createdOn
        updatedBy {
            cn
            uid
            rhatUUID
            mail
        }
        updatedOn
    }
}
```

##### Update mapping of app in property.
- Operation Name - UpdateLHApp
- Required Mutation variables type - `appId`,`LHPropertyAppInput`

```graphql
mutation UpdateLHApp($appId: ID!, appData: LHPropertyAppInput!) {
    updateLHApp(propertyId: $propertyId, appData: $appData) {
        _id
        name
        description
        projectId
        apps {
            id
            name
            branch
        }
        createdBy {
            cn
            uid
            rhatUUID
            mail
        }
        createdOn
        updatedBy {
            cn
            uid
            rhatUUID
            mail
        }
        updatedOn
    }
}
```

##### Delete mapping of app from property.
- Operation Name - DeleteLHApp
- Required Mutation variables type - `appId`

```graphql
mutation DeleteLHApp($appId: ID!) {
    deleteLHApp(appId: $appId) {
        _id
        apps {
            id
            name
            branch
        }
    }
}
```
