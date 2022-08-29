---
id: guides
title: Guides
slug: /console/guides
sidebar_label: Guides
---

## Get Started

1. Create a Project by visiting the [Developer Console](https://one.redhat.com/console)
2. Give your project a unique name, with an optional description
3. Once your project is created, you are ready to start using any of the services provided by the Platform.
   - To use any of the services, you can click on the service name on the left sidebar, or on the Overview page, which takes you to the the Service configuration page
   - You can define and configure how you want to use the service (this may differ from service to service)
   - Once you’ve set up the configurations, you are ready to use the services from your SPAs.
4. For backend applications, you may need to create API keys for authenticated access to the Platform APIs
   - To do that, click to the Project Settings on the left sidebar, then click on the API Keys tab on the top.
   - You can create an API Key here, with the appropriate access level permissions
   - Once the key is created, the key will be displayed in the UI. Copy this key, and treat it as a confidential password. You won’t be able to see the full key again after this.
   - Now your app can communicate with the Platform APIs securely!

## Hosting

One Platform also provides support for hosting your Single Page Applications. To deploy your app:

1. Go to the [Developer Console](https://one.redhat.com/console) -> Hosting
2. Create a new Application (Application here corresponds to a Single Page Application)
3. Give it a descriptive name (kebab-case), and provide a path where it should be hosted (should be a unique path)
4. Now you can create a deployment key for the application
5. And deploy it to One Platform using the SPAship CLI. You can find more information about how to deploy using [SPAship CLI here](https://spaship.io/docs/guide/user-guide/Quickstart/)
