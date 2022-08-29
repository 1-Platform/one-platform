---
id: faqs
title: Notification Service FAQs
slug: /notification/faqs
sidebar_label: FAQs
---

# FAQ

> What kind of Notifications are supported by the Notifications Microservice?

Email, Push and Banner. Webhooks will be added soon.

> What is the difference between Notification Config and a Notification Template?

Notification Templates are the text templates that use some templating engine (like Twig) to define a notification data.

> Do I have to create a Notification Config to use the Notifications Microservice?

No. The Notification Config is an alternative to the templates mostly to be used with Push and Banner notifications. It helps define the defaults and allows the Notifications Rule Engine to determine where and how the Notification should be sent.

> How does the Notifications microservice work?

The Notifications Microservice consists of 3 main components.

1. APIs
2. Rule Engine
3. Queue / Scheduler
