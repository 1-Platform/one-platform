---
id: spa-deployment-guideline
title: OP SPA Deployment Guideline
slug: /deployments/spa
sidebar_label: SPA Guideline
---

SPAs in One Platform are deployed using a Jenkins CI.

## Guide

1. Head to [Jenkins Instance](https://jenkins.dxp.redhat.com/job/cpops-jobs/job/One%20Platform/job/One%20Platform%20Home%20/)

![Jenkins Home Page](/img/spa-deployment-guide/step1.png)

<br/>
2. Click on build with parameter

![Build with parameter screen](/img/spa-deployment-guide/step2.png)

<br/>
3. Fill the spa name with the input and click on build

![Input form](/img/spa-deployment-guide/step3a.png)

4. Now the build will be running and you can view the progress

![Build progress](/img/spa-deployment-guide/step3b.png)

<br/>
5. Pipeline will ask for input confirmation on Stage and Prod deployment, you can either run/stop the pipeline respectively.

![Confirmation](/img/spa-deployment-guide/step3c.png)
