---
id: api-ref
title: API Reference
slug: /search/api-ref
sidebar_label: API Reference
---


# API Reference

You can test drive the available APIs on the [QA testing playground](https://qa.one.redhat.com/api/graphql)

Search Microservice provides a set of GraphQL Queries and Mutation APIs to allow developers manage the data with the Solr.

## Queries

| Query                                                                                                                                                                      | Description                                                                                                               |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| listSearchMap                                                                                                                                                        | Returns a list of all search map configs                                                                                 |
| getSearchMap(id: String!)                                                                                                                                             | Returns a search map with matching id                                                                                 |
| getSearchMapsByApp(appId: String)                                                                                                                                    | Finds a search map config with respective appId                                                                              |
| triggerSearchMap | Trigger search indexing job with the map config |
| search(query: String, start:Int, rows: Int)                                                                                                                                                   | Search endpoint for solr interface                                                                                 |

## Mutations

| Mutation                                                                 | Description                                                       |
| ------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| createSearchMap(appId: String!, searchMap: CreateSearchMapInput!)                      | Creates a new Search Map configuration                               |
| updateSearchMap(appId: String!, searchMap: UpdateSearchMapInput!)              | Modifies a Search Map configuration.                                |
| deleteSearchMap(id: String!)                                            | Delete a Search Map configuration with matching id                       |
| manageIndex(input: SearchInput, mode: String!) | Single endpoint to manage index creation, updation & deletion                          |
| createUpdateIndex(input: SearchInput)          | Search index creation & updation |
| deleteIndex(id: ID!)          | Deletes the search index with respective to the id |
