---
id: guides
title: Guides
slug: /notification/guides
sidebar_label: Guides
---

To get started with the Notifications Microservice, and to use it in your own apps, you can follow the following steps:

1. Create a notification config for your app from the One Platform Notifications Dashboard – https://one.redhat.com/notifications

2. Fill out the Notification Config form using the appropriate fields as are required for your use case.

3. Once the notification config has been created, you will get a unique configID. You can use this configID to send and receive notifications for your app.

4. To send a notification, you can use the existing GraphQL mutation newNotification to trigger a notification.

5. For example, if you want to send out a notification, when the document is created in your app, you can simply call the GraphQL mutation and pass it the required data, such as the subject, body, etc. and the Notifications Microservice will send out the notification via the appropriate channels to the target/end-users.
   a. If the notification config was created for email notifications, then the notification will be sent out as an email.
   b. If the notification config was created for Push or Banner notifications, then the notification will be sent out as a GraphQL subscription.

6. One Platform’s default navbar by default listens to all kinds of Push and Banner notifications for the respective logged in user. So any notification that is sent from your app for that user will be displayed to that user in the form of a pop-up in the UI, and also shown in the Notification Drawer.

7. If you want to listen to the notifications in your app, for example to perform some custom actions, you can use any GraphQL subscriptions client library to connect to the Notifications Microservice subscriptions API, using the subscription newNotifications and pass it the target that you want to listen to, and it will be triggered whenever a notification for that target is sent out.
