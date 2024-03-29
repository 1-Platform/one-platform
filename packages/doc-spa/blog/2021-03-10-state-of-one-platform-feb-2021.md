---
slug: state-of-one-platform-feb-2021
title: State of One Platform - February 2021
authors: ghanshyam
tags: [redhat, blog, oneportal, oneplatform, react, angular, february, update]
---

### Introduction

This is a summary of the development goals achieved by the One Platform team in the month of **February 2021**. This month the team had the following goals:

<!--truncate-->

- **Application Development:**

  - Home SPA Documentation Hub to access all the document at one place
  - Revamped pluggable Feedback SPA & Microservice development
  - Automated end-to-end testing for One Platform initial set of modules
  - DSAL stats dashboard & address user feedback
  - Microservices’ enhancements(continued)
  - Research Repository phase 2 features release

- **Onboarding:**

  - GDPR deployment on production
  - Onboarding discussions about Lifecycle, Pantheon, IR dashboard

- **Infrastructure update:**

  - New strategy for using an external image repository to build and store One Platform Microservice docker images (either quay.io or GitHub container registry)

- **Component Library:**
  - Feedback as a pluggable web component(opc-feedback)

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

<li>Revamped Feedback SPA & Service are deployed on QA & Stage and are being tested.</li>

<li>Notifications Microservice is completed, Notifications SPA designs in progress.</li>

<li>User Groups rover integration - Not started</li>

<li>Change Home Service schema into Developer Console schema</li>

<li>Developer console API developed</li>

<li>List of use cases & status for polishing microservices & SPAs is, as in the table below.
</li>
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

<li>Implemented a Document hub to access all the documents at one place.</li>

<li>Plans for using <a href="https://quay.io/">quay.io</a> for storing docker images for native microservices.</li>

<li>External app support - Acknowledged. Build a team to go external.</li>

<li>GDPR in production.</li>

<li>Lifecycle, Pantheon - In discussion.</li>
</ul>
   </td>
  </tr>
</table>

### Polishing microservice/SPA use cases:

<table>
  <tr>
   <td>Microservice
   </td>
   <td>Use Cases
   </td>
   <td>Status
   </td>
  </tr>
  <tr>
   <td>Feedback
   </td>
   <td>Published the opc-feedback component and testing the SPA, Microservice in QA and Stage.
   </td>
   <td>In Progress
   </td>
  </tr>
  <tr>
   <td>Notifications
   </td>
   <td>Revamped Notifications microservice is completed and Revamped Notifications design & UI are underway.
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
   <td rowspan="3" >Home Service (convert into Developer Console Service)
   </td>
   <td>Change Home Service schema into Developer Console schema
   </td>
   <td>In Testing
   </td>
  </tr>
  <tr>
   <td>Build APIs for managing Projects/Apps for the developer console
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

The team was able to close 33 JIRAs across a range of development priorities. The highlights are:

- **Application development and readiness:**

  - **Native Apps:**

    - Feedback:
      - Added custom target support for the flexibility to choose where feedback issues are reported
      - Pluggable API & web component to collect feedback for web properties other than One Platform
    - Developer Console:
      - Transformed the old home-service to app-service to accommodate the developer console needs. Being tested for the final release.
      - UI implementation underway
    - Notifications:
      - Design discussions for One Platform Notification Management SPA
    - Search
      - Created initial prototype for the search data automation

  - **Non-Native Apps:**

    - Research Repository: Phase 2 features released
    - DSAL: Ongoing development for DSAL Dashboard & Minor bug fixes
    - Video Library: User feedback addressed

  - **Component Library:**
    - Published the feedback component
      - [https://www.npmjs.com/package/@one-platform/opc-feedback](https://www.npmjs.com/package/@one-platform/opc-feedback)

- **Onboarding**
  - Lifecycle SPA
    - Deployed Lifecycle Admin SPA to QA, Ticket to add redirect URLs is in TODO
  - GDPR
    - Released on production at /personal-data-request and waiting for acknowledgement from the team to close GDPR
  - Pantheon
    - We are in discussion with the team. The team is to evaluate the options and finalize, Next follow up with the team is scheduled in April
  - IR Dashboard
    - We did a feasibility study for the IR Dashboard SPA to onboard it to One Platform, Tried to separate the SPA & API

### What's coming?

- **SPA Onboarding:**
  - GDPR production release after confirmation from the testing team about the expected functionalities.
  - Lifecycle Admin SPA deployment & testing on QA and Stage.
  - Pantheon onboarding follow-ups, approach evaluation & decision.
- **Development and Adoption Priorities**
  - Developer Console:
    - Build and release the Developer Console Dashboard UI
- **One Platform Test Automation:**
  - Automated end-to-end testing for all native modules
  - Test report automation & dashboard using Jenkins

For more updates related to One Platform, please check out the One Platform Blog at [one.redhat.com/get-started/blog](https://one.redhat.com/get-started/blog/)

### Meta

**Completed Sprint:** One Platform – Feb '21

**Ongoing/Upcoming Sprint:** One Platform – Mar'21

**One Platform:** [one.redhat.com](https://one.redhat.com)

**JIRA:** [https://projects.engineering.redhat.com/projects/ONEPLAT/issues](https://projects.engineering.redhat.com/projects/ONEPLAT/issues)

**GitHub:** [https://github.com/1-Platform/one-platform/issues](https://github.com/1-Platform/one-platform/issues)

## Questions

For any questions, please reach out to the One Platform team over [one-platform-devs@redhat.com](mailto:one-platform-devs@redhat.com) or ping us over [One Platform GChat Room](https://chat.google.com/room/AAAAF4M7oZE).
For more information please view [FAQs](/docs/faqs).
