---
id: api-ref
title: API Reference
slug: /apps-service/api-ref
sidebar_label: API Reference
---

# API Reference

You can test drive the available APIs on the [QA testing playground](https://qa.one.redhat.com/api/graphql).

Some of the queries and mutations provided by the Apps Service are:

## Queries

| Query                               | Description                                                                                                                          |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| myApps                              | Returns a list of all Apps you have registered. The user id is deduced from the Authorization header (i.e. JWT Token or the API Key) |
| app(appId: String!)                 | Returns the metadata of a single app by it's unique appId                                                                            |
| findApps(selectors: FindAppsInput!) | Used to find an app by any of the available fields                                                                                   |

## Mutations

| Mutations                                | Description                                             |
| ---------------------------------------- | ------------------------------------------------------- |
| createApp(app: CreateAppInput!)          | Creates/Registers a new app/project                     |
| updateApp(id: ID!, app: UpdateAppInput!) | Update/modify the metadata of your existing app/project |
| deleteApp(id: ID!)                       | Delete an existing app/project                          |
