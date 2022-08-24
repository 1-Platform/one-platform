---
id: api-ref
title: API Reference
slug: /user-group/api-ref
sidebar_label: API Reference
---

# API Reference

You can test drive the available APIs on the [QA testing playground](https://qa.one.redhat.com/api/graphql).

Some of the queries and mutations provided by the User Groups Service are:

## Queries

| Query                                                                           | Description                                                                                 |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| getUsersBy(uid: String, rhatUUID: String)                                       | Returns user details for the given `uid` or `rhatUUID`                                      |
| listUsers                                                                       | Returns all the users from the local cache                                                  |
| searchRoverUsers( ldapfield: ldapFieldType, value: String, cacheUser: Boolean ) | Search users based on a criteria from Rover and optionally cache them into the local cache. |
| group(cn: String!)                                                              | Returns group details and members of a LDAP / Rover Group                                   |

## Mutations

| Mutation                       | Description                                                      |
| ------------------------------ | ---------------------------------------------------------------- |
| addUser(input: UserInput!)     | Creates a new User                                               |
| addUserFromRover(uid: String!) | Fetch user information from LDAP / Rover and add to the cache DB |
| updateUser(input: UserInput)   | Updates user information                                         |
| deleteUser(\_id: String!)      | Delete user matching the provided `_id`                          |
