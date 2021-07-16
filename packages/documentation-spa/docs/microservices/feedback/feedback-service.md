---
id: feedback-service
title: Feedback Service
sidebar_label: Feedback Service
slug: /microservices/feedback-service
---

## Developers

### Component Contributors

1. Rigin Oommen - [roommen@redhat.com](mailto:roommen@redhat.com) - [riginoommen (Rigin Oommen) · GitHub](https://github.com/riginoommen)

## Getting Started

Feedback Microservice is one of the major pillar of One Platform ecosystem. This enables the support to share the feedback with the project management tools.

#### Integrations Supported
 * Jira
 * GitLab
 * GitHub

## Usage

### Introduction

Feedback microservice is built using NodeJS. This interface collects the data from GraphQL API and interacts with the project management tool provided in the configuration

### Supported Features
1. Create Feedback
2. Update Feedback
3. Update Feedback Index
4. Delete Feedback
5. List all Feedbacks
6. List Feedback by ID

#### Apps using this microservice
* All Native and Non native SPAs

### Quick Start Guide

#### Prerequisites
1. **NodeJS** should be installed (_version\&gt;=__v14.15.4_)
2. **NPM** should be installed _(version\&gt;= __6.4.1__ )_
3. Version control system required. Preferably **git**.

#### Steps

1. Clone the [repository](https://github.com/1-Platform/one-platform).

```sh
git clone git@github.com:1-Platform/one-platform.git
```

2. Switch the working directory to the user microservice

```sh
cd one-platform/packages/feedback-service
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
#### List all Feedbacks

- Operation Name - ListFeedbacks

Example Query
```bash
query ListFeedbacks {
  listFeedbacks {
    _id
    summary
    description
    experience
    error
    config
    state
    ticketUrl
    category
    source
    module
    assignee{
      name
      uid
      email
    }
    createdOn
    createdBy {
      name
      uid
      email
    }
    updatedOn
    updatedBy {
      name
      uid
    }
  }
}
```
@@### List Feedback

- Operation Name - ListFeedback
- Variables - ```_id```

Example Query
```bash
query ListFeedbacks($_id: ID!) {
  listFeedback(_id: $_id) {
    _id
    summary
    description
    experience
    error
    config
    state
    ticketUrl
    category
    source
    module
    assignee{
      name
      uid
      email
    }
    createdOn
    createdBy {
      name
      uid
      email
    }
    updatedOn
    updatedBy {
      name
      uid
    }
  }
}
```

### Mutations
#### Create feedback
1. Create new feedback to database and open the ticket accordingly.

- Operation Name - CreateFeedback

- Variables - _FeedbackInput_

Example Mutation
```bash
mutation CreateFeedback($input: FeedbackInput!) {
  createFeedback(input: $input) {
    _id
    ticketUrl
  }
}
```
#### Update feedback

- Operation Name - UpdateFeedback
- Variables - _FeedbackInput_

Example Mutation

```bash
mutation UpdateFeedback($input: FeedbackInput!) {
  updateFeedback(input: $input) {
    _id
    summary
    description
    experience
  }
}
```
#### Delete feedback

- Operation Name - DeleteFeedback
- Variables - __id_

Example Mutation

```bash
mutation UpdateFeedback($input: FeedbackInput!) {
  updateFeedback(input: $input) {
    _id
    summary
    description
    experience
  }
}
```


#### Update feedback search index

- Operation Name - UpdateFeedbackIndex

Example Mutation

```bash
mutation UpdateFeedbackIndex {
  updateFeedbackIndex{
    status
  }
}
```
