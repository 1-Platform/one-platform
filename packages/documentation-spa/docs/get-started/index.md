---
id: get-started
title: Getting Started with One Platform
sidebar_label: Getting Started
slug: /
---

---

Follow this guide to use the One Platform in your client-side or server-side app.

## Step 1: Create a One Platform Project

Before you can start using any of the One Platform services, you need to create a project on One Platform and register your app.

<details>
<summary><strong>Create a Project</strong></summary>

1. Visit the [One Platform Developer Console](https://one.redhat.com/console), click **Add Project**.

   - Enter the Project Name to identify your project.
   - And a Description to describe what this project is for.

2. Click "Add Project".

Once the project is created, you'll be taken to the Overview page for your Project in the Developer Console.

</details>

<details>
<summary><strong>Configure the required Services</strong></summary>

You can now configure any of the One Platform Services you need from the Developer Console.

Just follow the on screen process for each services you need to configure. If stuck, click on the help button on the top right of any screen.

</details>

## Step 2: Deploy your Apps to One Platform

One Platform supports front-end SPA deployments using SPAship.

See [Getting Started with SPAship](/docs/spaship).

## Step 3: Access One Platform Service APIs in your app

You can now start using the configured One Platform Services directly from your app.

<details>
<summary><strong>Front-end apps</strong></summary>

Your app can talk to the One Platform GraphQL APIs directly from the front-end. The requests must be authenticated using Keycloak JWT tokens.

See [Authentication](/docs/microservices/authorization) for more details.

</details>

<details>
<summary><strong>Back-end apps</strong></summary>

For back-end / server-side apps, you need to create an API Key to access the One Platform APIs.

1. Visit the [One Platform Developer Console](https://one.redhat.com/console) and select your Project.
2. Go to the **Project Settings** and click on the **API Keys** tab.
3. Create a new API Key by clicking on the **New API Key** button.
   - You can choose which permissions you want to grant your application. We recommend only granting the minimum required permissions to meet your project goals.

Now you can use this API Key to authenticate server-side requests to the One Platform APIs.

</details>

## Available One Platform Services

| Service       | Documentation                                          |
| ------------- | ------------------------------------------------------ |
| User Groups   | [View Docs](/docs/microservices/user-groups-service)   |
| Notifications | [View Docs](/docs/microservices/notifications-service) |
| Search        | [View Docs](/docs/microservices/search-service)        |
| Feedback      | [View Docs](/docs/microservices/feedback-service)      |
| Lighthouse    | [View Docs](/docs/microservices/lighthouse-service)    |
| Apps          | [View Docs](/docs/microservices/apps-service)          |
