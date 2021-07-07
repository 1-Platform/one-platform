---
id: search-service
title: Search Service
sidebar_label: Search Service
slug: /microservices/search-service
---

## Developers

## Component Contributors

1. Rigin Oommen - [roommen@redhat.com](mailto:roommen@redhat.com) - [riginoommen (Rigin Oommen) · GitHub](https://github.com/riginoommen)

## Getting Started

Search Microservice is a pillar which talks to Hydra APIs integrated with solr instances. This microservice is used to manage the search index

## Usage

### Introduction

Search microservice is built using NodeJS which has hydra API support. This microservice serves as the index store for the one platform. Most of the SPAs and microservices uses this data to implement search functionality.

### Supported Features

1. Create Search Index
2. Update Search Index
3. Delete Search Index
4. Read Search Index

#### Apps using this microservice

* All Native and Non native SPAs

### Quick Start Guide

#### Prerequisites

1. **NodeJS** should be installed (_version\&gt;=__v10.15.3_)
2. **NPM** should be installed _(version\&gt;= __6.4.1__ )_
3. Version control system required. Preferably **git**.

#### Steps

1. Clone the [repository](https://github.com/1-Platform/one-platform).

```sh
git clone git@github.com:1-Platform/one-platform.git
```

2. Switch the working directory to the user microservice

```sh
cd one-platform/packages/search-service
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

```sh
npm run test
```

### API References

In the GraphQL GET Operations are defined as Queries and POST/PUT/PATCH operations are defined as Mutations.

## Queries

### Search Query

- Operation Name - search
    - Supported Query Variables - query, start, rows

Example Query
```graphql
query Search($query: String, $start: Int, $rows: Int) {
    search(query: $query, $start: 10: $rows: 10) {
        responseHeader{
            status
            }
    response {
        numFound
        docs {
            id
            title
            abstract
            description
            icon
            uri
            tags
            timestamp
        }
    }
}
```
## Mutations

In search microservice every record has a unique key called id which is used to manage the mutation.

1. Add/Update new index

### Operation Name - manageIndex

- Required Mutation Variables - SearchInput

Example Mutation
```graphql
mutation ManageIndex($input: SearchInput) {
    manageIndex(input: $input) {
        response {
            docs: [{
                id
                title
                abstract
                description
                icon
                uri
                tags
                timestamp
            }]
        }
    }
}
```
### Delete from index

- Operation Name - deleteIndex

    - Required Mutation Variables - name, title, uid, rhatUUID, memberOf, createdBy, createdOn, updatedBy, updatedOn

Example Mutation

```graphql
mutation DeleteIndex($id: String!) {
    deleteIndex(id:$id) {
        status
    }
}
```
