---
slug: state-of-one-platform-mayjun-2021
title: State of One Platform - May, June 2021
author: Ghanshyam Lohar
author_title: Senior Software Engineer @ Red Hat
author_url: https://github.com/ghanlohar
author_image_url: https://avatars.githubusercontent.com/u/5575651?s=400&v=4
tags: [redhat, blog, oneportal, oneplatform, react, angular, vue, may, june, update]
---
### Meta
**Completed Sprint:** One Platform – May & June '21

**Ongoing/Upcoming Sprint:** OP – Jul'21 Mid Sprint

**One Platform:** [one.redhat.com](https://one.redhat.com)

**JIRA:** [https://projects.engineering.redhat.com/projects/ONEPLAT/issues](https://projects.engineering.redhat.com/projects/ONEPLAT/issues)

**GitHub:** [https://github.com/1-Platform/one-platform/issues](https://github.com/1-Platform/one-platform/issues)

### Introduction
This is a summary of the development goals achieved by the One Platform team in the months of May and June 2021. This month the team had the following goals:

- **Application Development:** Federated Notifications UI, Developer Console UI, Rover integration for User Group SPA, Apps Service Enhancements, Lighthouse and Innovation hub SPA development

- **Onboarding:** Onboarding discussions with Attachment viewer, Escalation list & Pantheon

- **Infrastructure update:** Coordinate with other teams & complete the prerequisites to make One Platform available externally(outside VPN)

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

<li>Lighthouse CI Release</li>

<li>Developer console UI and integration to the App Service release over QA & Stage environment.</li>

<li>CI/CD pipeline automation</li>

<li>Continuing building e2e test cases</li>

<li>Innovation hub SPA readiness</li>
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

<li>Escalation watchlist: Readiness to onboard.</li>

<li>Pantheon Continued conversations.</li>

<li>New home page designs to support rebranding of One Platform.</li>

<li>SFM2.Next & Resource Hub - In conversation </li>

<li>SPA & Microservice enhancements </li>

<li>Rebranding One Platform portal as Application Hub </li>

<li>Make One Platform Externally accessible (outside VPN) </li>
</ul>
   </td>
  </tr>
</table>

### Key highlights
In the month of May & Jun, The team was able to close 67 JIRAs across a range of development priorities. The highlights are:

*   **Application development and readiness:**

      * **Native Apps:**

        *   Developer Console:
            *   UI integrations with One Platform Microservices for enabling and customising the microservice features for an App
            *   Enhancements to the Apps Service APIs for better integration with the Developer Console
        *   Lighthouse CI Release and GA:
            *   Catalog team adopted the lighthouse CI
            *   Lighthouse SPA & Microservice Development - Microservice & SPA development in progress.
        *   Home Page enhancements:
            *   New Developer focused Home page has been rolled out with the enhancements
            *   SSI Improvements that includes getting started
        *   Deploy to One Platform automation release
            *   Button and deployment backend automation support
            *   Integration with SPAship for SPA deployments

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
    *   Case Attachment viewer SPA Onboarding in progress
    *   Followed up on Pantheon onboarding, The Pantheon team is weighing the options available

*   **E2E test automation:**
    *   Refinement of e2e test reports.
    *   Test suite implementation User Group is completed

*   **Development and Adoption Priorities**
    *   Team worked with IT, Legal, InfoSec to make[ one.redhat.com](http://one.redhat.com/) externally available. All the prerequisites are in place.

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
*   **One Platform Test Automation:**
    *   Send test reports as an inline mail body to the configured Email IDs
    *   Further implementation of test suites for remaining One Platform native modules
*   Adopt and Implement recommended solutions as a result of 3D Developer Experience research and brainstorming.
*   One Platform home page enhancements

For more updates related to One Platform, please check out the One Platform Blog at [one.redhat.com/get-started/blog](https://one.redhat.com/get-started/blog/)

## Questions

For any questions, please reach out to the One Platform team over [one-portal-devel@redhat.com](mailto:one-portal-devel@redhat.com) or ping us over [One Platform GChat Room](https://chat.google.com/room/AAAAF4M7oZE).
For more information please view [FAQs](/docs/faqs).
