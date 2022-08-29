---
id: api-ref
title: API Reference
slug: /notification/api-ref
sidebar_label: API Reference
---

# API Reference

You can test drive the available APIs on the [QA testing playground](https://qa.one.redhat.com/api/graphql)

Notifications Microservice provides a set of GraphQL Queries and Mutation APIs to allow developers to create, edit, delete their Notification Configs and Notifications.

## Queries

| Query                                                            | Description                                                                                                                                                                                                                                                                                       |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| notificationTemplates                                            | Returns a list of all notificationTemplates                                                                                                                                                                                                                                                       |
| notificationTemplate(id: ID!)                                    | Returns a notificationTemplate with matching id                                                                                                                                                                                                                                                   |
| findNotificationTemplates(selectors: FindNotificationTemplates!) | Finds a notification template matching the given selectors                                                                                                                                                                                                                                        |
| listActiveNotifications                                          | Returns a list of Active Notifications. <br/> It accepts a parameter limit, to restrict the number of notifications in the response. (The default limit is 25)                                                                                                                                    |
| listArchivedNotifications(targets: [String]!)                    | Returns a list of the old/archived notifications. <br/> It accepts a mandatory parameter targets which can be used to get the notifications for the provided targets. <br/> It also accepts a parameter limit, to restrict the number of notifications in the response. (The default limit is 25) |
| getNotificationsBy(selector: FindNotificationInput!)             | Returns notifications matching the given selection criteria. <br/> It accepts a parameter “selector” of type NotificationPayloadInput.                                                                                                                                                            |

## Mutations

| Mutation                                                                   | Description                                                       |
| -------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| createNotificationTemplate(template: CreateNotificationTemplate!)          | Creates a new notification template                               |
| updateNotificationTemplate(id: ID!, template: UpdateNotificationTemplate!) | Modifies a notification template                                  |
| deleteNotificationTemplate(id: ID!)                                        | Delete a notification template matching id                        |
| triggerNotification(templateID: ID!, payload: NotificationPayloadInput!)   | Trigger notification using a template ID                          |
| newNotification(configID: ID!, payload: FindNotificationInput!)            | Creates a new notification using a config and add it to the queue |
