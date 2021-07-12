---
slug: state-of-one-platform-apr-2021
title: State of One Platform - Apr 2021
author: Ghanshyam Lohar
author_title: Senior Software Engineer @ Red Hat
author_url: https://github.com/ghanlohar
author_image_url: https://avatars.githubusercontent.com/u/5575651?s=400&v=4
tags: [redhat, blog, oneportal, oneplatform, react, angular, vue, april, update]
---
### Meta
**Completed Sprint:** One Platform – Apr'21

**Ongoing/Upcoming Sprint:** One Platform – May'21

**One Platform:** [one.redhat.com](https://one.redhat.com)

**JIRA:** [https://projects.engineering.redhat.com/projects/ONEPLAT/issues](https://projects.engineering.redhat.com/projects/ONEPLAT/issues)

**GitHub:** [https://github.com/1-Platform/one-platform/issues](https://github.com/1-Platform/one-platform/issues)

### Introduction
This is a summary of the development goals achieved by the One Platform team in the month of April 2021. This month the team had the following goals:

- **Application Development:** Federated Notifications UI, Developer Console UI, Architecture of monitoring microservice, DSAL Ansible Dashboard, User Group Rover integration, Lighthouse Microservice GA release

- **Onboarding:** Lifecycle Admin SPA on Prod, Onboarding discussions for Attachment viewer SPA & Cert SPA

- **Infrastructure update:** Monitoring the pod status on OpenShift using OpenShift's inbuilt monitoring service, Monitoring SPAs & Microservices using their health-check endpoints from Catchpoint

- **E2E test automation:**  Test report automation & notification over the email. Test suite development for search module

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
   <td>On Track
(Continued)
   </td>
   <td>
<ul>

<li>Lighthouse microservice setup is complete and released to production.</li>

<li>Developer console UI and integration to the App Service is in progress</li>

<li>Catchpoint checks configurations for Microservices and SPAs is completed</li>

<li>E2E test cases for Feedback, SSI, Home & Search are completed</li>

<li>E2E tests for dev console & user groups are In Progress</li>

<li>List of use cases & statuses for polishing microservices & SPAs are, as in the table below</li>

</ul>
   </td>
  </tr>
  <tr>
   <td><strong>Evolve<a href="http://one.redhat.com/"> one.redhat.com</a> as a single place to host internal applications and accessible outside VPN. </strong>
   </td>
   <td>On Track

(Continued)
   </td>
   <td>
<ul>

<li>Ticket to update new domains in<a href="http://hdn.corp.redhat.com/proxy.pac"> http://hdn.corp.redhat.com/proxy.pac</a> - Completed</li>

<li>Escalation watchlist: Initiated the discussion with the team they are evaluating One Platform & will get back to us</li>

<li>Pantheon - Decision pending on Pantheon team due to architectural changes they are making</li>

<li>Enhanced home designs to improve user experience and look and feel of the homepage</li>
</ul>
   </td>
  </tr>
  <tr>
   <td><strong>Non-native Application development</strong>
   </td>
   <td>On Track
   </td>
   <td>
<ul>

<li>Outage Management SPA: POV demoed, decision on the use of statuspage vs service now in the coming weeks</li>

<li>DSAL Ansible migration & UI fixes</li>

<li>Lifecycle Admin SPA - Released on production</li>
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
   <td>Completed
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
(previously Home Service)
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
The team was able to close 16 JIRAs across a range of development priorities. The highlights are:

*   **Application development and readiness:**

      * **Native Apps:**

        *   Developer Console:
            *   UI implemented for Developer Console
            *   UI integrations with One Platform Microservices for enabling and customizing the microservice features for an App
        *   Notifications:
            *   Implementation of a federated UI for notifications management went into further discussion to make a common consumable component
        *   Lighthouse CI GA’ed:
            *   Catalog team adopted the lighthouse CI
            *   Lighthouse SPA & Microservice Development - Microservice & SPA development in progress.
        *   Home Page enhancements

      * **Non Native Apps:**

        *   Outage SPA
            *   Proof of Value demoed, decision on the use of statuspage vs service now in the coming weeks.
        *   DSAL
            *   Dashboard migration
            *   Ansible Pipelines migration nearing completion

      * **Designs:**

        *   Design for Lighthouse SPA
        *   Design for POC for app monitoring & analytics
        *   New one platform home design is finalized
*   **Onboarding**
    *   Lifecycle admin SPA released on production at [/lifecycle ](https://one.redhat.com/lifecycle/)
    *   Followed up on Pantheon onboarding, The Pantheon team is weighing the options available
*   **E2E test automation:**
    *   Generation of HTML reports & send them across the email as an attachment.
    *   Test suite implementation for search is completed

### What's coming?

*   **_Deploy to One Platform_ automation**
    *   Develop a button, Form, SPA metadata
    *   Automate the deployment process
    *   Integration with SPAship, API Key generation
*   **_Developer Console_** GA Release
*   SPA Continuous Deployment (CD) automation
*   **SPA Onboarding:**
    *   Cert Apps SPA onboarding discussions
    *   Escalation Watchlist SPA onboarding discussions
    *   Pantheon followup
*   **Development and Adoption Priorities**
    *   Lighthouse GA release
    *   One platform to work with IT, Legal, InfoSec to make[ one.redhat.com](http://one.redhat.com/) externally available
*   **One Platform Test Automation:**
    *   Send test reports as an inline mail body to the configured Email IDs
    *   Further implementation of test suites for remaining One Platform native modules
*   Adopt and Implement recommended solutions as a result of 3D Developer Experience research and brainstorming.
*   One Platform home page enhancements

For more updates related to One Platform, please check out the One Platform Blog at [one.redhat.com/get-started/blog](https://one.redhat.com/get-started/blog/)

## Questions

For any questions, please reach out to the One Platform team over [one-portal-devel@redhat.com](mailto:one-portal-devel@redhat.com) or ping us over [One Platform GChat Room](https://chat.google.com/room/AAAAF4M7oZE).
For more information please view [FAQs](/docs/faqs).
