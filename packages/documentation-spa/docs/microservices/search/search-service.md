---
id: search-service
title: Search Service
sidebar_label: Search Service
slug: /microservices/search-service
---

## Developers

1. Rigin Oommen - [roommen@redhat.com](mailto:roommen@redhat.com) - [riginoommen (Rigin Oommen) · GitHub](https://github.com/riginoommen)
2. Ghanshyam Lohar - [glohar@redhat.com](mailto:glohar@redhat.com) - [ghanlohar (Ghanshyam Lohar) · GitHub](https://github.com/ghanlohar)

## Getting Started

Search Microservice is a pillar which talks to Hydra APIs integrated with solr instances. This microservice is used to manage the search index

## Usage

### Introduction

Search microservice is built using NodeJS which has hydra API support. This microservice serves as the index store for the one platform. Most of the SPAs and microservices uses this data to implement search functionality.

### Supported Features

1. Create, Update & Delete Search Index
2. Read Search Index
3. Create, Update & Delete Search Map
6. List the Search Map
7. List Search Map by `_id`


#### Apps using this microservice

* All Native & Non-Native SPAs

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
## API References

In the GraphQL GET Operations are defined as Queries and POST/PUT/PATCH operations are defined as Mutations.
### Queries
#### Search Query

- Operation Name - Search
- Supported Query Variables - `query`, `start`, `rows`

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
#### List Search Maps Query
- Operation Name - ListSearchMap

Example Query
```graphql
query ListSearchMap {
    listSearchMap {
        _id
        appId
        apiConfig
        fields
        preferences
        createdBy
        createdOn
        updatedBy
        updatedOn
    }
}
```
#### List Search Map by `_id`

- Operation Name - GetSearchMap
- Supported Query Variables - `_id`

Example Query
```graphql
query GetSearchMap($_id: String!) {
    getSearchMap(_id: $_id) {
        _id
        appId
        apiConfig
        fields
        preferences
        createdBy
        createdOn
        updatedBy
        updatedOn
    }
}
```
### Mutations
#### Create/Update/Delete data in index
- Operation Name - ManageIndex
- Required Mutation variables type - `SearchInput`, `mode`

Example Mutation
```graphql
mutation ManageIndex($input: SearchInput, $mode: String!) {
    manageIndex(input: $input, mode: $mode) {
        status
    }
}
```
#### Create/Update data in index
- Operation Name - CreateUpdateIndex
- Required Mutation variables type - `SearchInput`

Example Mutation
```graphql
mutation CreateUpdateIndex($input: SearchInput) {
    CreateUpdateIndex(input: $input) {
        status
    }
}
```
#### Delete data from index

- Operation Name - DeleteIndex
- Required Mutation Variable - `id`

Example Mutation

```graphql
mutation DeleteIndex($id: String!) {
    deleteIndex(id:$id) {
        status
    }
}
```
#### Create Search Map
- Operation Name - CreateSearchMap
- Required Mutation variables type - `SearchMapInput`

Example Mutation
```graphql
mutation CreateSearchMap($input: SearchMapInput) {
    createSearchMap(input: $input) {
        _id
        appId
        apiConfig
        fields
        preferences
        createdBy
        createdOn
        updatedBy
        updatedOn
    }
}
```
#### Update Search Map
- Operation Name - UpdateSearchMap
- Required Mutation variables type - `SearchMapInput`

Example Mutation
```graphql
mutation UpdateSearchMap($input: SearchMapInput) {
    updateSearchMap(input: $input) {
        _id
        appId
        apiConfig
        fields
        preferences
        createdBy
        createdOn
        updatedBy
        updatedOn
    }
}
```
#### Delete Search Map

- Operation Name - DeleteSearchMap
- Required Mutation Variable - `id`

Example Mutation

```graphql
mutation DeleteSearchMap($id: String!) {
    deleteSearchMap(_id: $id) {
        status
    }
}
```
## Code Snippets
#### Universal Helper code for indexing the data with search microservice.

- Language - Javascript
```js
manageSearchIndex(data: any, mode: string) {
    let query: string = `
    mutation ManageIndex($input: SearchInput, $mode: String!) {
        manageIndex(input: $input, mode: $mode) {
            status
        }
    }`;
    let headers = new Headers();
    // Authorization Token for API gateway
    headers.append(`Authorization`, `${ process.env.GATEWAY_AUTH_TOKEN }`);
    headers.append(`Content-Type`, `application/json`);
    // API Gateway URL.
    return fetch(`${ process.env.API_GATEWAY }`, {
            method: `POST`,
            headers,
            body: JSON.stringify({
                query: query,
                variables: {
                    input: mode === 'index' ? data?.input : data,
                    mode
                }
            }),
        }).then((response: any) => {
            return response.json();
        })
        .then((result: any) => {
            const successStatusCodes = [200, 204];
            if (successStatusCodes.includes(result.data?.manageIndex?.status)) {
                console.info('Sucessfully completed the index updation')
            } else if (!successStatusCodes.includes(result.data?.manageIndex?.status)) {
                console.info('Error in index updation.');
            }
        })
        .catch((err: Error) => {
            throw err;
        });
}
```
