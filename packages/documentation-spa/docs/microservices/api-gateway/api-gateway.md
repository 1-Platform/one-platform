---
id: api-gateway
title: API Gateway
sidebar_label: API Gateway
slug: /microservices/api-gateway
---
***

The One Platform API Gateway is the entrypoint to get started with using the APIs and services provided by the One Platform.

It provides a single gateway for all the GraphQL APIs available across the multitude of microservices provided by the One Platform.

## Getting Started

Any developer can access the APIs provided by the API Gateway as long as the requests are authenticated.

### Authenticating your API requests

You can autheticate your API calls to the API Gateway using 2 different techniques depending on how you want to use the APIs.

1. **Directly from the Client-side App (Keycloak)**

    The API Gateway supports Red Hat's Internal Keycloak Single Sign On for API authentication. To use this, you just have to authenticate your request using the Red Hat Internal Keycloak provider, and use the JWT Bearer token for the Authorization header.

2. **From a backend service or a bot**

    The API Gateway also supports API Key based authentication for service-to-service access. For this, you need to register your app/project on the One Platform Developer Console. You can create and manage your API Keys on the Developer Console, and use the created API Keys in your API Calls.

### API Reference

The API Gateway is basically a collection / entrypoint for the One Platform Microservices. So the API Gateway provides a complete stiched schema collected from all the GraphQL Queries and Mutations exposed by the Microservices.

The Microservices available via the API Gateway are:
- [User & Groups](/get-started/docs/microservices/user-groups-service)
- [Feedback Service](/get-started/docs/microservices/feedback-service)
- [Notifciations Service](/get-started/docs/microservices/notifications-service)
- [Search Service](/get-started/docs/microservices/search-service)
- [Apps Service](/get-started/docs/microservices/apps-service)

## Developers

- Mayur Deshmukh - mdeshmuk@redhat.com

## FAQs

<details><summary>What can I do from the API Gateway?</summary>
The API Gateway is the entrypoint to the One Platform's Internal Microservices. So if you need to use any of the microservices, or integrate your own apps/services, then the API Gateway provides an easy way to access the microservices using a single GraphQL API Endpoint.
</details>

<details><summary>Can I add my own service to the API Gateway?</summary>
No currently. The API Gateway in it's current implemenation is made for the One Platform's internal microservices.

But having said that, we're working on a new and updated Gateway/Portal which will allow anyone to add their own Services to the One Platform API Gateway easily and take advantage of the common authentication and authorization provided by the Gateway. Look forward to that.
</details>
