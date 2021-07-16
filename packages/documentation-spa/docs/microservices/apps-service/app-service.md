---
id: apps-service
title: Apps Service
sidebar_label: Apps Service
slug: /microservices/apps-service
---
***

Apps Service is the indexing service which allows you to create and manage individual apps/projects on One Platform. It provides CRUD operations for the app metadata.

## Getting Started

Any developer can use the Apps Service to view the metadata for their apps, and to configure the One Platform Microservice integrations.

To get started with the Apps Service, follow the steps below:

1. Register your app on the [One Platform Developer Console](https://one.redhat.com/console)
2. Setup an API Key for your app/project
3. Now you can use the API Key for authenticated access to the One Platform API Gateway to access the GraphQL APIs

## GraphQL API Reference

You can test drive the available GraphQL APIs on the QA testing playground here:
https://api.qa.one.redhat.com/graphql

Some of the queries and mutations available for use are:

### Apps

<details><summary>Queries</summary>

| Query | Description |
|---|---|
| `myApps` | Returns a list of all Apps you have registered. The user id is deduced from the Authorization header (i.e. JWT Token or the API Key) |
| `app(appId: String!)` | Returns the metadata of a single app by it's unique `appId` |
| `findApps(selectors: FindAppsInput!)` | Used to find an app by any of the available fields |

</details>

<details><summary>Mutations</summary>

| Mutation | Description |
|---|---|
| `createApp(app: CreateAppInput!)` | Creates/Registers a new app/project |
| `updateApp(id: ID!, app: UpdateAppInput!)` | Update/modify the metadata of your existing app/project |
| `deleteApp(id: ID!)` | Delete an existing app/project |

</details>

### Microservices

<details><summary>Queries</summary>

| Query | Description |
|---|---|
| `myServices` | Returns a list of all services you have registered. The user id is deduced from the Authorization header (i.e. JWT Token or the API Key) |
| `service(serviceId: String!)` | Returns the metadata of a single service by it's unique `serviceId` |
| `findServices(selectors: FindServiceInput!)` | Used to find an service by any of the available fields |

</details>

<details><summary>Mutations</summary>

| Mutation | Description |
|---|---|
| `createService(service: CreateServiceInput!)` | Creates a new Service |
| `updateService(id: ID!, service: UpdateServiceInput!)` | Update/modify the metadata of an existing service |
| `deleteService(id: ID!)` | Delete an existing service |

</details>

## Apps using this microservice:

- Developer Console SPA
- Homepage and Global Navigation

## Developers

- Mayur Deshmukh – mdeshmuk@redhat.com

## FAQs

<details><summary>Who is the App Service APIs for?</summary>
The App Service APIs are for any developer who wants use the metadata of an app they have registered on the One Platform.
</details>

<details><summary>Can anyone create an App? How do I create a new App?</summary>
Yes. Anyone can create an app as long as you have an internal Red Hat account (i.e. as long as you are a Red Hat employee).

To create a new App, it is recommended to use the [Developer Console UI](https://one.redhat.com/console) as it provides a graphical interface for quickly and easily creating an app/project on One Platform.
</details>

<details><summary>I already have an app created, can I still register an existing app?</summary>
Yes. If you want to integrate you app with any of the One Platform Microservices, registering you app in the Apps Service (via the Developer Console or the Apps Service APIs) is the easiest way to do so.
</details>

<details><summary>What is the difference between Apps and Services in the App Service?</summary>
The Apps are any app or projects you have or that you are working on.

The Services are reserved for the metadata of the One Platform's internal microservices.
</details>
