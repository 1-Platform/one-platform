---
id: op-architecture
title: One Platform Architecture
sidebar_label: One Platform Architecture
slug: /architecture
---

One Platform entirely focuses on,

- Core interaction of native & non-native apps/microservices.
- Generate maximum value to both developers and users.
- Enhancing and provide consistent developer experience.

![OP Arch](/img/getting-started/op-arch.png)

OP Architecture majorly consist of two components

1. The SPA deployment base provided by SPASHIP

2. The Unified Core API Service provided by a Federated GraphQL

## Core Services

Core services provides the basic interactive for any application like Authentication, Feedback, Notification etc

Some of the core services provided by One Platform are:

### Authentication

One platform has different strategies for authentication. At the Client-side, internal auth is supported (auth.redhat.com) and at the API gateway, JWT token from Internal auth. The API key is supported. SPAs are authenticated default through SSI authentication support.

### SSI Components

One Platform provides global components, including a Navigation bar, Feedback action button, etc. These are provided as pluggable web components, published under `one-platform` namespace in npm. They provide flexibility and extensibility to the SSI.

### User Group

The simplest microservice is a wrapper over Rover that uses LDAP to authorize users. The plan is to give away complete ownership control to developers so the platform can stay out of the authorization business. User-group microservice plays the role of the middleware which talks to the organization's user data store. This is primarily integrated with LDAP and Rover. Also, it manages a minimal data store for faster data processing. This data store is updated daily with sync scripts. Native/Non-native microservices/SPAs can benefit from this for managing the user information.

### Feedback

The goal of feedback microservice is to let users submit feedback in 3 easy steps i.e. Select App, select Experience, and Describe a problem to help developers and the Platform team (in case of core services) build context for better decisions. The feedback services integrated with the ticketing system (Jira & GitLab) so developers can follow up with end-users and record satisfaction. This provides complete transparency as data is visible to all visitors and helps to increase the value of the applications.

### Notification

It is the core communication microservice of the platform for native(inbuilt) and non-native apps. It enables developers to select & configure the mode of communication for individual apps. The need for microservices to communicate with each other, many of which does not necessitate real-time communication, demanded the need of an engine that can help to notify the users of the event without bothering about the health and response of users. We kept it lightweight to ensure a quick response.

### Search

One Platform goal is to consolidate applications and make them searchable in real-time. It should be a single point of contact for end-users when they are looking for an app. The Search microservices would not only resolve app search problems however it would extend the search to app contents. This helps to design & develop an native app search.

### Developer Console

The developer's dashboard or the rather the control plane of One Platform. A single point to manage all your SPA's and there corresponding OP service utilization.

### API Gateway

The responsibility of the API gateway is to record “which service is communicating, with whom, and is it allowed to do so”. Access Control is implemented on top of the API Gateway which enables the authorization and permission model in the data flow. Also, it is a single source of truth for the entire one platform backend. Websocket support is also provided in the gateway.

The supported authorization models are:

- JWT Tokens from auth.redhat.com
- API Key

## Hosted Services

There exist hosted services maintained by One Platform Team to enhance developer experience even furthur. Some of these are

### Lighthouse

Lighthouse is a Google Open Source Webpage Audit tool the measure's various parameters like SEO, PWA, Accessibility etc. One Platform has hosted the Lighthouse CI server for CI Testing and also an interactive, yet simple UI to get your SPA's Lighthouse progress.

### API Catalog

API Catalog is One Platform's effort to resolve API discoverability in an organization. In simple terms, it's a catalog to discover various API's provided by various team. It helps developers to manage, promote and share APIs with their users. Users can get various information regarding API like the owners or maintainers of it, various pre-prod and prod instances available, etc. API Catalog also provides toolsets to play around with the APIs.
