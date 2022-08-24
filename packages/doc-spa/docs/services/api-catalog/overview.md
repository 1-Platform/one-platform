---
id: overview
title: What is API Catalog
slug: /api-catalog
sidebar_label: Overview
---

# Overview

API Catalog is a one-stop shop for getting the APIs of your organization. It helps developers to manage, promote and share APIs with their users. Users can get various information regarding API like the owners or maintainers of it, various pre-prod and prod instances available, etc. API Catalog also provides toolsets to play around with the APIs.

## Features

1. Supports REST and GraphQL API
2. API metadata like
   a. Information regarding the owners/maintainers and mailing list to connect with them
   b. Pre-prod environments available
   c. Documentation link and application link
   d. Depreciation notice for schemas getting depreciated
   e. VPN protected instance or not
3. Each type of API has a set of tools for users to tryout
   a. REST API: Swagger and Redoc
   b. GraphQL API: GraphQL Playground
4. Link it with the status component and get to know whether it's operational or not
5. CMDB information
6. Change Subscription

## Subscription

API Catalog also helps you to get notified of an API change. Users can subscribe to get notifications via mail for each instance of an API. When a schema change happens, the API catalog will send an email in detail notifying what all the breaking change and nonbreaking changes happened.

## Tools

These are the tools in API Catalog for users to get to play around with an API.

- Swagger (REST)

  It's a popular tool that helps you to generate interactive documentation from an Open API schema. Developers need to provide a valid Open API schema to use in swagger.

- Redoc (REST)

  Redoc is another popular tool that generates user-friendly static documentation for reference from an Open API spec sheet provided.

- GraphQL Playground (GraphQL)

  It's a popular tool among the GraphQL community. Playground connects with a GraphQL server and, based on the GraphQL introspection received, generates IntelliSense and a dashboard to try out various queries. In API Catalog you need to provide an introspection URL or the server URL itself if introspection is allowed.
