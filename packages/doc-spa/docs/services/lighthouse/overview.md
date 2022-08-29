---
id: overview
title: What is Lighthouse
slug: /lighthouse
sidebar_label: Overview
---

# Overview

Lighthouse is an open-source tool developed by Google to measure the quality of web pages. Google Lighthouse audits the performance, accessibility, and search engine optimization of web pages. One Platform Lighthouse is a hosted service of Lighthouse provided for developers to audit their SPA. One Platform offers an additional SPA to access and compare your score to others of an organization.

1. [Lighthouse CI Server](https://lighthouse.one.redhat.com)

   The Lighthouse CI enables running Lighthouse from various CI environments like GitLab, Jenkins, Github etc.

2. [Lighthouse SPA](https://one.redhat.com/lighthouse)

   Lighthouse SPA is an app which is built over Lighthouse CI which has a great consolidated view of the lighthouse reports. It also consists of a leaderboard where the web properties are organized based on the lighthouse scores.

## Features

1. Leaderboard to compare your project's score with others in your organization
2. A consolidated dashboard that shows your project's progress
3. Get your project's latest score
4. Get an insight into your project's score compared to others
5. Export scores into CSV
6. Live playground to audit a webpage on the fly
7. Lighthouse server for more complex visualization

## Lighthouse CI Server

Lighthouse CI Server is a hosted service where developers will be able to submit their reports. It's a centralized unit where all the reports get aggregated and later visualized for more advanced insights. Developers execute audits using Lighthouse CLI and then submit them to the hosted service. You can visit the One Platform hosted Lighthouse server here.
