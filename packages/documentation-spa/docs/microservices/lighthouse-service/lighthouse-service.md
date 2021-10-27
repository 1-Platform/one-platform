---
id: lighthouse-service
title: Lighthouse Service
sidebar_label: Lighthouse Service
slug: /microservices/lighthouse-service
---

## Getting Started

Lighthouse microservice provides the ecosystem to perform the CI operations to test a website with [@lhci/ci](https://www.npmjs.com/package/@lhci/ci) also it consists of APIs which is integrated with [@lhci/server](https://www.npmjs.com/package/@lhci/server)

[Lighthouse SPA](/docs/apps/internal/lighthouse) connects with lighthouse microservice to provide a sleek interface for testing and viewing lighthouse scores.

## Usage

### Introduction

Lighthouse microservice is built using NodeJS v14.16.0 which has a direct integration with Lighthouse Server Postgres. This microservice serves as the backend for the Lighthouse SPA. Some of the queries are made via Lighthouse Server API while some are directly fetched from Lighthouse Server Postgres instance to speed up the queries. All the lighthouse database operations are read and its made from `lighthouse db manager` . This microservices consists of mainly

1. Audit Manager
   - Configurations associated with the CI environment.
2. Lighthouse SPA Config
   - Used by developer console to set mapping between developer console SPA and Lighthouse Projects
3. Lighthouse DB Manager
   - Handles communication with lighthouse ci directly.

### Supported Features

1. Audit a website with Lighthouse and upload the results to server.
2. APIs for the Lighthouse Server & Dashboard
3. API for the leaderboard ranking Lighthouse scores on various categories like
    - Progressive Web App (PWA)
    - Best Practices
    - SEO
    - Performance
    - Accessibility
4. APIs for developer console to setup Lighthouse properties

### Quick Start Guide

#### Prerequisites

1. **NodeJS** should be installed (\_version >= **v14.16.0** )
2. **NPM** should be installed _(version >= **6.14.11** )_
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

3. Set the environment variables by copying the `.env.example` to `.env`

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
- Supported Query Variables - `limit`,`offset`,`search`
- Fetched from Lighthouse Database

```graphql
query ListLHProjects($limit: Int, $offset: Int, $search: String) {
  listLHProjects(limit: $limit, offset: $offset, search: $search) {
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
- Supported Query Variables - `projectID`,`buildID`
- Fetched from Lighthouse Database

```graphql
query ListProjectLHReport($projectID: String!, $buildID: String!) {
  listProjectLHReport(projectID: $projectID, buildID: $buildID) {
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
- Fetched from Lighthouse API

```graphql
query VerifyLHProjectDetails($serverBaseUrl: String, $buildToken: String!) {
  verifyLHProjectDetails(
    serverBaseUrl: $serverBaseUrl
    buildToken: $buildToken
  ) {
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
- Fetched from Lighthouse Database

```graphql
query ListLHProjectBuilds($projectID: String!, $branch: String!, $limit: Int!) {
  listLHProjectBuilds(projectID: $projectID, branch: $branch, limit: $limit) {
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
- Supported Query Variables - `projectID`,`limit`,`offset`,`search`
- Fetched from Lighthouse Database

```graphql
query ListLHProjectBranches(
  $projectID: String!
  $limit: Int
  $offset: Int
  $search: String
) {
  listLHProjectBranches(
    projectID: $projectID
    limit: $limit
    offset: $offset
    search: $search
  ) {
    branch
  }
}
```

##### Fetch the scores of the tests executed with lighthouse microservice.

- Operation Name - ListLHScore
- Supported Query Variables - `auditId`
- Fetched from Lighthouse Database

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

##### Fetch the leaderboard ranked based on build scores of each category

- Operation Name - listLHLeaderboard
- Supported Query Variables - `LHLeaderBoardCategory`, `limit`, `offset`, `Sort`
- Fetched from Lighthouse Database

```graphql
query ListLHLeaderboard(
  $type: LHLeaderBoardCategory!
  $limit: limit
  $offset: offset
  $sort: Sort
) {
  listLHLeaderboard(type: $type, limit: $limit, offset: $offset, sort: $sort) {
    count
    rows {
      score
      rank
      build {
        id
        projectId
        branch
        runAt
        createdAt
        updatedAt
      }
      project {
        id
        name
        slug
        externalUrl
        token
        adminToken
        baseBranch
        createdAt
        updatedAt
      }
    }
  }
}
```

#### Mutations

##### Create a project in Lighthouse Server

- Operation Name - createLHProject
- Requried Mutation variables type - `project`

```graphql
mutation CreateLHProject($project: AddLHProjectInput) {
  createLHProject(project: $project)
}
```

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

### LH SPA Config

#### Queries

##### List all SPA configurations

- Operation Name - ListLHSpaConfigs
- Supported Query Variables - `limit`, `offset`,`user`

```graphql
query ListLHSpaConfigs($limit: Int, $offset: Int, $user: String) {
  listLHSpaConfigs(limit: $limit, offset: $offset, user: $user) {
    _id
    appId
    projectId
    branch
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

##### Get a Lighthouse SPA Config by id

- Operation Name - GetLHSpaConfigById
- Supported Query Variables - `id`

```graphql
query GetLHSpaConfigById($id: ID!) {
  getLHSpaConfigById(id: $id) {
    _id
    appId
    projectId
    branch
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

##### Get a Lighthouse SPA Config by App Id

- Operation Name - GetLHSpaConfigByAppId
- Supported Query Variables - `appId`

```graphql
query GetLHSpaConfigByAppId($id: String!) {
  getLHSpaConfigByAppId(appId: $appId) {
    _id
    appId
    projectId
    branch
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

##### Create new lighthouse spa config.

- Operation Name - CreateLHSpaConfig
- Required Mutation variables type - `AddLHPropertyInput`

```graphql
mutation CreateLHSpaConfig($lhSpaConfig: CreateLHSpaConfigInput!) {
  createLHSpaConfig(lhSpaConfig: $lhSpaConfig) {
    _id
    appId
    projectId
    branch
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

##### Update a lighthouse spa config by id.

- Operation Name - UpdateLHSpaConfig
- Required Mutation variables type - `UpdateLHSpaConfigInput`,`id`

```graphql
mutation UpdateLHSpaConfig($id: ID!, $data: UpdateLHSpaConfigInput) {
  updateLHSpaConfig(id: $id, data: $data) {
    _id
    appId
    projectId
    branch
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

##### Delete a lighthouse SPA config.

- Operation Name - DeleteLHSpaConfig
- Required Mutation variables type - `id`

```graphql
mutation DeleteLHSpaConfig($id: ID!) {
  deleteLHSpaConfig(id: $id) {
    _id
    appId
    projectId
    branch
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

## Developers

1. Akhil Mohan - [akmohan@redhat.com](mailto:akmohan@redhat.com) - [akhilmhdh (Akhil Mohan) · GitHub](https://github.com/akhilmhdh)
2. Rigin Oommen - [roommen@redhat.com](mailto:roommen@redhat.com) - [riginoommen (Rigin Oommen) · GitHub](https://github.com/riginoommen)
