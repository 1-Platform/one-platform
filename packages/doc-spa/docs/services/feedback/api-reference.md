---
id: api-ref
title: API Reference
slug: /feedback/api-ref
sidebar_label: API Reference
---

# API Reference

You can test drive the available APIs on the [QA testing playground](https://qa.one.redhat.com/api/graphql)

Feedback Microservice provides a set of GraphQL Queries and Mutation APIs to allow developers to perform CRUD operations on their Feedback Configs and feedbacks.

## Queries

| Query                                                                                                                                                                      | Description                                                                                                               |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| listFeedbackConfigs                                                                                                                                                        | Returns a list of all listFeedbackConfigs                                                                                 |
| getFeedbackConfigById(id: ID!)                                                                                                                                             | Returns a feedbackConfig with matching id                                                                                 |
| getFeedbackConfigByAppId(appId: String)                                                                                                                                    | Finds a feedbackConfig with respective appId                                                                              |
| listFeedbacks(search: String, limit: Int, offset: Int, category: [FeedbackCategory], appId: [String], createdBy: String, status: FeedbackStatus, sortBy: FeedbackSortType) | Returns a list of feedbacks with pagination support. It also filter the data by the category, appId, createdBy and status |
| getFeedbackById(id: ID!)                                                                                                                                                   | Returns the feedback with the matching id                                                                                 |

## Mutations

| Mutation                                                                 | Description                                                       |
| ------------------------------------------------------------------------ | ----------------------------------------------------------------- |
| createFeedbackConfig(payload: FeedbackConfigInput!)                      | Creates a new feedback configration                               |
| updateFeedbackConfig(id: ID, payload: FeedbackConfigInput!)              | Modifies a feedback configuration                                 |
| deleteFeedbackConfig(id: ID!)                                            | Delete a feedback configuration matching id                       |
| createFeedback(input: FeedbackInput!) | Creates new Feedback                          |
| updateFeedback(id: ID!, input: FeedbackInput!)          | Updates the feedback with respective to the id |
| deleteFeedback(id: ID!)          | Deletes the feedback with respective to the id |
| updateFeedbackIndex          | Updates and Sync the Feedback search index |
