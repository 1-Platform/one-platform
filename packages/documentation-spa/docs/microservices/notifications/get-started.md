---
id: notifications-get-started
title: Getting Started with Notification Templates
sidebar_label: Get Started with Templates
slug: /microservices/notifications-service/get-started
---
***

Follow this guide to use One Platform Notifications Service in your app.

**Note:** This guide shows the steps to using Notifications Service using Email Templates, for Push Notifications and Subscriptions, please refer the <a href="#" title="WIP" disabled>Get Started with Notification Subscriptions</a>.

#### Prerequisites

- An API Key for the One Platform API Gateway. (Please contact the One Platform Admins to get an API Key for your application)

### Step 1: Create a Notification Template

Before you can start sending Notifications, you need to create a Template.

A Template is as the name suggests, a template consisting of the non-dynamic content of a notification, which can be used by multiple notifications of the same type. You can create a different template for each kind of notification that your app uses.

To create a template, use the following GraphQL mutation on the One Platform API Gateway:

```graphql
mutation NewTemplate($template: CreateNotificationTemplate!) {
  createNotificationTemplate(template: $template) {
    templateID
    ... on NotificationTemplate {
      # ... other fields if required
    }
  }
}
```

The `$template` can be passed as a variable of type:

```graphql
input CreateNotificationTemplate {
  name: String!
  description: String!
  subject: String!
  body: String!
  templateEngine: NotificationTemplateEngineEnum
  owners: [ID!]!
  isEnabled: Boolean
}
enum NotificationTemplateEngineEnum {
  TWIG
  HBS
  NJK
}
```

If the `templateEngine` is null, `TWIG` is used as default. (Only TWIG is supported currently, any other template is treated as plain text.)

The mutation, on successful execution, returns an object with a `templateID`. Make a note of this, or store it in your app, as this will be used in the next step for sending notifications.

### Step 2: Sending a Notification

After a template is created, sending a notification is as simple as calling an API endpoint.

Using the template we just created in Step 1 <sup>[^](#step-1-create-a-notification-template)</sup>, we can now send a notification using the following GraphQL mutation:

```graphql
mutation NewNotification($templateID: ID!, $payload: NotificationPayloadInput!) {
  triggerNotification(templateID: $templateID, payload: $payload) {
    ... on TriggerNotification {
      data
      priority
      willRunAt
    }
  }
}
```

Here the `$templateID` is what we got after creating a new template, and `$payload` has the following type:

```graphql
input NotificationPayloadInput {
  to: [RecipientInput!]!
  cc: [RecipientInput]
  bcc: [RecipientInput]
  data: Data
}
input RecipientInput {
  email: String!
  preferredName: String
}
```

Here, the `cc` and `bcc` are optional fields.

**Note:** The `data` property is a JSON object which can contain the key-value pairs for the variables used in the template (`data` should be in JSON format, and is only applicable to a TWIG template).

### Additional Notes

The `data` property in `NotificationPayloadInput` has some basic validations to check for the first-level variable names.

i.e. for the following twig template

```twig
Hi {{ user.name }},

{{ message }}
```

The mutation checks if `data` includes the keys `user` and `message`, and not the nested property `user.name`.
