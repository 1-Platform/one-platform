---
id: guides
title: Guides
slug: /api-catalog/guides
sidebar_label: Guides
---

## Onboarding An API

All APIs in API Catalog must belong to a namespace. A namespace is like a container to hold multiple APIs of a group in an organization. It can be REST or GraphQL. So as an example, One Platform can be considered a namespace, and One Platform GraphQL API can be one of the APIs in its namespace.

Onboarding an API in API Catalog is an easy process. All you need to follow is a simple multi-step wizard form.

1. Go to [API Creation Page in API Catalog](https://one.redhat.com/developers/api-catalog/apis/new)
2. Step 1 asks for namespace details like name, description, and owners - mailing list.
3. Step 2 is where you add APIs that belong to your namespace
   a. Fill up required information like name, description, API type, documentation URL, application URL, etc.
   b. Provide the instances in which API can be accessed like QA, Stage, etc.
   c. Fill in other information as VPN protected.
4. You can add more APIs for your namespace here
5. Step 3 is a review step in which you can review all the data you have now inserted.
6. That's it, Submit the information, and tadaaa your APIs are onboarded.

## How does the API subscription work?

1. To subscribe to an API, first head over to the detailed section of an API.
2. Under each schema, there will be a subscription button.
3. When you click on subscription, you can select the instances like QA and Stage to which you want to subscribe.
4. That's it. When the schema has any changes, the API catalog will monitor the provided schema and notify you of the change by email.
5. The email will contain all the breaking changes and non-breaking changes.
