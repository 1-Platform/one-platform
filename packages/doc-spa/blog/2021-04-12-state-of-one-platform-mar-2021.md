---
slug: state-of-one-platform-mar-2021
title: State of One Platform - March 2021
authors: ghanshyam
tags: [redhat, blog, oneportal, oneplatform, react, angular, march, update]
---

### Introduction

This is a summary of the development goals achieved by the One Platform team in the month of **March 2021**. This month the team had the following goals:

<!--truncate-->

- **Application Development:** Federated Notifications UI, Developer Console UI, Home, Feedback & Search SPA enhancements, DSAL Dashboard migration & UI fixes, Outage SPA MVP features

- **Onboarding:** GDPR in Prod, Lifecycle Admin SPA on Stage

- **Infrastructure update:** GitHub Actions workflow setup, Testing the OpenShift automatic deployment triggers, Continuous Deployment on Stage

- **E2E test automation:** Test report automation & dashboard using Jenkins and test suite implementation for Home, SSI & Feedback.

### OKRs

<table>
  <tr>
   <td>Objectives
   </td>
   <td>Status
   </td>
   <td>IMP Summary from Key Results
   </td>
  </tr>
  <tr>
   <td><strong>Accelerate and provide consistent SPA development & delivery experience</strong>
   </td>
   <td>At Risk
   </td>
   <td>
<ul>

<li>Lighthouse PoC and demos</li>

<li>Catchpoint checks configurations for Microservices and SPAs</li>

<li>e2e tests for Home and SSI</li>

<li>Feedback e2e test cases – In Progress</li>

<li>Setting up the e2e tests on jenkins</li>

<li>The list of use cases & statuses for polishing microservices & SPAs is, as in the table below</li>
</ul>
   </td>
  </tr>
  <tr>
   <td><strong>Evolve<a href="http://one.redhat.com/"> one.redhat.com</a> as a single place to host internal applications and accessible outside VPN. </strong>
   </td>
   <td>On Track
   </td>
   <td>
<ul>

<li>GDPR - Released on production
</li>
<li>Lifecycle Admin SPA - Deployed on Stage & testing for the expected functionalities is In Progress.
</li>
<li>Pantheon - Decision pending on Pantheon team due to architectural challenges
</li>
<li>Outage Management SPA development
</li>
<li>DSAL features development
</li>
<li>Home & Search UI enhancements
</li>
<li>GitHub actions created for automated image builds for all the One Platform Microservices
</li>
</ul>
   </td>
  </tr>
</table>

### Polishing microservice/SPA use cases:

<table>
  <tr>
   <td>Microservice
   </td>
   <td>Use cases
   </td>
   <td>Status
   </td>
  </tr>
  <tr>
   <td>Feedback
   </td>
   <td>Published the opc-feedback component and testing the SPA, Microservice in QA and Stage.
   </td>
   <td>Completed
   </td>
  </tr>
  <tr>
   <td rowspan="2" >Notifications
   </td>
   <td>Revamped Notifications microservice
   </td>
   <td>Completed
   </td>
  </tr>
  <tr>
   <td>Revamped Notifications UI is underway.
   </td>
   <td>In Progress
   </td>
  </tr>
  <tr>
   <td rowspan="2" >Search
   </td>
   <td>Rover integration.
   </td>
   <td>In Progress
   </td>
  </tr>
  <tr>
   <td>Suggestions based on user search history.
   </td>
   <td>Not Started
   </td>
  </tr>
  <tr>
   <td rowspan="2" >User Groups
   </td>
   <td>Rover integration to get user data
   </td>
   <td>In Progress
   </td>
  </tr>
  <tr>
   <td>Build API authorization based on user-groups
   </td>
   <td>Not Started
   </td>
  </tr>
  <tr>
   <td rowspan="2" >Apps Service
    <p>
        (previously Home Service)
    </p>
   </td>
   <td>Deployment and testing of Apps Service on QA
   </td>
   <td>In Progress
   </td>
  </tr>
  <tr>
   <td>Developer console UI
   </td>
   <td>In Progress
   </td>
  </tr>
  <tr>
   <td>API gateway
   </td>
   <td>Periodic GraphQL IntrospectSchema refresh, for up-to-date schema on the API Gateway
   </td>
   <td>Not Started
   </td>
  </tr>
</table>

### Key highlights

The team was able to close 28 JIRAs across a range of development priorities. The highlights are:

- **Application development and readiness:**

  - **Native Apps:**

    - Developer Console:
      - UI implemented for Developer Console
      - UI integrations with One Platform Microservices for enabling and customizing the microservice features for an App
    - Notifications:
      - Implementation of a federated UI for notifications management is In Progress
    - Feedback:
      - Released revamped Feedback SPA & microservice to production
    - Search
      - Improvised UI to make Search more user friendly
      - Implemented provision to push the data to the search ecosystem for third party microservice

  - **Non-Native Apps:**

    - Outage SPA
      - Worked on create/update of incident & maintenance leveraging the StatusPage APIs for the SPA and deployed it on QA at [/outages](https://qa.one.redhat.com/outages/)
    - Video Library:
      - User feedback addressed
    - DSAL
      - Dashboard migration
      - UI fixes

  - **Component Library:**

    - Added basic StoryBook Support for each component.

  - **Designs:**

    - Design modifications: Search UI, Notifications UI and Application menu UI.
    - Discussions on improving UX of home & SSI.

- **Onboarding**
  - GDPR released on One Platform production
  - Outage SPA MVP features deployed on QA
  - Follow up on Pantheon onboarding, The Pantheon team is weighing the options available
  - Feasibility analysis done for the IR dashboard, Team tried to separate the SPA & API & concluded that this is not the right candidate for One Platform.
- **E2E test automation:**
  - Generation of HTML reports for test run & combine them into a single report
  - Test suite implementation for Home, SSI & Feedback is completed

### What's coming?

- **“Deploy to One Platform” automation**
  - Develop a button, Form, SPA metadata
  - Automate the deployment process
  - Integration with SPAship, API Key generation
- Lighthouse microservice GA release
- Developer Console GA Release
- Outage SPA GA release
- SPA Continuous Deployment automation
- **SPA Onboarding:**
  - Lifecycle Admin SPA release on production.
  - Next follow up on Pantheon onboarding with the team.
  - Case Attachments Viewer SPA onboarding discussions.
- **Development and Adoption Priorities**
  - POC for Integrating Lighthouse CI and Lighthouse CI Server
  - One platform to work with IT, Legal, InfoSec to make[ one.redhat.com](http://one.redhat.com/) externally available.
- **One Platform Test Automation:**
  - Send test reports as a inline mail body to the configured Email IDs
  - Further implementation of test suites for remaining One Platform native modules
- Adopt and Implement recommended solutions as a result of 3D Developer Experience research and brainstorming.

For more updates related to One Platform, please check out the One Platform Blog at [one.redhat.com/get-started/blog](https://one.redhat.com/get-started/blog/)

### Meta

**Completed Sprint:** One Platform – Mar'21

**Ongoing/Upcoming Sprint:** One Platform – Apr'21

**One Platform:** [one.redhat.com](https://one.redhat.com)

**JIRA:** [https://projects.engineering.redhat.com/projects/ONEPLAT/issues](https://projects.engineering.redhat.com/projects/ONEPLAT/issues)

**GitHub:** [https://github.com/1-Platform/one-platform/issues](https://github.com/1-Platform/one-platform/issues)

## Questions

For any questions, please reach out to the One Platform team over [one-portal-devel@redhat.com](mailto:one-portal-devel@redhat.com) or ping us over [One Platform GChat Room](https://chat.google.com/room/AAAAF4M7oZE).
For more information please view [FAQs](/docs/faqs).
