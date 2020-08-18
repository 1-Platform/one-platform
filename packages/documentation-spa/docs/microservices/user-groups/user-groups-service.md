---
id: user-groups-service
title: User/Group Service
sidebar_label: User/Group Service
---
***

## Developers

### Component Contributors

1. Rigin Oommen - [roommen@redhat.com](mailto:roommen@redhat.com) - [riginoommen (Rigin Oommen) · GitHub](https://github.com/riginoommen)

## Getting Started

User group service acts as the primary pillar for obtaining enterprise user information for the one platform. This service talks to the organizational data sources like LDAP.

## Usage

### Introduction

User group microservice is built using NodeJS which has mongodb integration as database support. This microservice serves as the data store for the one platform. Most of the SPAs and microservices uses this data to populate user information.

### Supported Features

1. GraphQL endpoints for the user and group information
2. Scripts to update the user information in data store.
3. LDAP integration.

### Apps using this microservice

1. Feedback
2. Notifications

### Quick Start Guide

**Prerequisites**

1. **NodeJS**  should be installed (*version>=**v10.15.3*)
2. **NPM** should be installed *(version>=**6.4.1**)*
3. Version control system required. Preferably **git**.

**Steps**

1. Clone the [repository](https://github.com/1-Platform/one-platform).

    ```sh
    git clone git@github.com:1-Platform/one-platform.git
    ```

2. Switch the working directory to the user  microservice

    ```sh
    cd one-platform/packages/user-service
    ```

3. Install the microservice dependencies.

    ```sh
    npm i
    ```

**Start**

1. Run npm start:dev to run your microservice for dev env and npm start for production env.
2. Navigate to port 8080 to see the microservice.
    eg: <http://localhost:8080/graphql>

**Build**

1. [Webpack](https://webpack.js.org) is used for the build system in the microservices.
2. Run `npm build:dev` to generate a build for dev env and npm build for production build.

**Testing**

1. For testing microservice with [supertest](https://www.npmjs.com/package/supertest) with the preconfigured settings.
2. Test related environment configurations are present in `.test.env` under the `e2e` folder.
3. Execute the command for testing.

    ```sh
    npm run test
    ```

## API References

In the GraphQL GET Operations are defined as Queries and POST/PUT/PATCH operations are defined as Mutations.

### Queries

1. ### Fetch User

   **Operation Name:** getUserBy

    **Supported Query Variables:** *uid*, *rhatUUID*, *apiRole*, *name*

    **Example Query:**

    ```js
    query getUserBy($uid: String) {
        getUsersBy(uid: $uid) {
            _id
            name
            title
            uid
            rhatUUID
            memberOf
            isActive
            apiRole
            createdBy
            createdOn
            updatedBy
            updatedOn
        }
    }
    ```

2. ### Fetch All Users List

    **Operation Name:** ListUsers

    **Example Query:**

    ```js
    query ListUsers {
        listUsers {
            _id
            name
            title
            uid
            rhatUUID
            memberOf
            isActive
            apiRole
            createdBy
            createdOn
            updatedBy
            updatedOn
        }
    }
    ```

3. ### Fetch group members included in a Rover / LDAP group

    **Operation Name:** GetGroupMembers

    **Supported Query Variables:** cn

    **Example Query:**

    ```js
    query GetGroupMembers($cn: String) {
        getGroupMembers(cn: $cn) {
            dn
        }
    }
    ```

### Mutations

1. ### Add new user

    **Operation Name:** AddUser

    **Required Mutation Variables:** *name*, *title*, *uid*, *rhatUUID*, *memberOf*, *createdBy*, *createdOn*, *updatedBy*, *updatedOn*

    **Example Mutation:**

    ```js
    mutation AddUser($input: UserInput) {
        addUser(input: $input) {
            name
            title
            uid
            rhatUUID
            memberOf
            isActive
            memberOf
            createdBy
            createdOn
            updatedBy
            updatedOn
        }
    }

2. ### Add new user from LDAP

    **Operation Name:** AddUserFromLDAP

    **Required Mutation Variables:** *uid*

    **Example Mutation:**

    ```js
    mutation AddUserFromLDAP($uid: String!) {
        addUserFromLDAP(uid: $uid) {
            name
            title
            uid
            rhatUUID
            memberOf
            isActive
            memberOf
            createdBy
            createdOn
            updatedBy
            updatedOn
        }
    }
    ```

3. ### Update user

    **Operation Name:** UpdateUser

    **Required Mutation Variables:** *name*, *title*, *uid*, *rhatUUID*, *memberOf*, *createdBy*, *createdOn*, *updatedBy*, *updatedOn*

    **Example Mutation:**

    ```js
    mutation UpdateUser($input: UserInput) {
        updateUser(input: $input) {
            name
            title
            uid
            rhatUUID
            memberOf
            isActive
            apiRole
            createdBy
            createdOn
            updatedBy
            updatedOn
        }
    }
    ```

4. ### Delete user

    **Operation Name:** DeleteUser

    **Required Mutation Variables:** *name*, *title*, *uid*, *rhatUUID*, *memberOf*, *createdBy*, *createdOn*, *updatedBy*, *updatedOn*

    **Example Mutation:**

    ```js
    mutation DeleteUser($id: String!) {
        deleteUser(_id:$id) {
            name
            title
            uid
            rhatUUID
            memberOf
            isActive
            apiRole
            createdBy
            createdOn
            updatedBy
            updatedOn
        }
    }
    ```
