---
id: guides
title: Guides
slug: /feedback/guides
sidebar_label: Guides
---

## How to use the Feedback component?.

Feedback component is an UI element which can be integrated with the Single Page Applications(SPA). It is published in the [npm](https://www.npmjs.com/package/@one-platform/opc-feedback) as a web component. You can use `npm`, `yarn` or `pnpm` to install to your SPA configuration. SPA specific configurations are provided in the [opc-feedback](https://www.npmjs.com/package/@one-platform/opc-feedback) documentation.

## What is Feedback SPA?.

Feedback SPA is the app which provides the consolidated view of the feedback received. Users will be able to see the feedback which they collected from multiple sources such as JIRA, GitHubm GitLab and Email along with the updated status and assignee. This helps the users to track their feedback more effectively. Feedback App is deployed over [One Platform](https://one.redhat.com/feedback)

## What is Feedback Microservice?.

Feedback Microservice is the integration Layer built to connect the datasources for the CRUD operations for the feedback management. It also provides the GraphQL APIs for managing the data. JIRA, EMAIL, GitLab and GitHub integrations are currently supported.
