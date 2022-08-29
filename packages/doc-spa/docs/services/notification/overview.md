---
id: overview
title: What is Notification Service
slug: /notification
sidebar_label: Overview
---

# Overview

Notifications Microservice provides the essential GraphQL APIs required for the Notifications Framework. It includes graphql queries for configuring notifications and templates, triggering notifications, listening for notifications, etc.

Any developer can use the Notification Microservice to utilize/implement notifications in their App. They just have to create a notification config or a template, and they can start sending or listening to notifications using the GraphQL APIs and Subscriptions.

## Features

1. Email Notifications
2. Push/Pop-up Notifications (Using GraphQL subscriptions)
3. Email Templates using Twig for template engine

## Architecture

![Notification framework architecture](/img/notification-service/arch.png)
