---
slug: state-of-one-platform-jan-2021
title: State of One Platform - January 2021
authors: ghanshyam
tags: [redhat, blog, oneportal, oneplatform, react, angular, january, update]
---

This is a summary of the development goals achieved by the One Platform team in the month of **January 2021**. This month the team had the following goals:

<!--truncate-->

- **Application Development:**

  - Lightweight Feedback SPA (Vue.js) development complete
  - Revamped Notifications framework development
  - DSAL migrated to One Platform
  - Microservices' enhancements

- **Infrastructure update:**

  - Migration of QA environment from PSI to MPaaS
  - In conversation with IT on Catchpoint adoption and configuration

- **Component Library:**
  - Initial storybook support for the components

### OKRs

| Objectives                                                                                            | Status   | IMP Summary from Key Results                                                                                                                                                                                                      |
| ----------------------------------------------------------------------------------------------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Accelerate and provide consistent SPA development & delivery experience**                           | On Track | Revamped Notifications & Feedback are In Progress. User Groups rover integration is In Progress. Extending Home Service as Developer Console service. List of use cases for polishing microservices & SPAs are as in table below. |
| **Evolve one.redhat.com as a single place to host internal applications and accessible outside VPN.** | On Track | Documentation update on the Feedback, API layer, WebComponent & Other microservices. Expected to be completed by the end of February. Infrastructure readiness for QA, Stage and Production on Managed Platform.                  |

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
   <td>As per the new use cases list
   </td>
   <td>In Progress
   </td>
  </tr>
  <tr>
   <td>Notifications
   </td>
   <td>As per the new use cases list
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
   <td rowspan="2" >Home Service (convert into Developer Console Service)
   </td>
   <td>Change Home Service schema into Developer Console schema
   </td>
   <td>In Progress
   </td>
  </tr>
  <tr>
   <td>Build APIs for managing Projects/Apps for the developer console
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
  <tr>
   <td>SSI
   </td>
   <td>Shorter version of SSI
   </td>
   <td>Not Started
   </td>
  </tr>
</table>

### Key highlights

The team was able to close 11 JIRAs across a range of development priorities and was able to push 13 issues to “Development Complete”. The highlights are :

- **Application development and readiness**
  - **Native Apps**:
    - **API Gateway**: API update to manage API keys generated.
    - **Feedback**: Next version of Feedback app developed, Dynamic target integration with Gitlab, JIRA, GitHub ready to use.
    - **Developer Console**: New microservice implementation in progress which aggregates all the SPA and microservices configurations at a single place.
    - **Notifications**: Enhancements in SPA & Microservice are completed. Implementation underway for requirements of DXP Drupal Properties.
    - **User Groups and Authorization**: Enhancements implemented.
    - **Home**: Categorization of deployed SPAs into Native & Non-native categories.
  - **Non Native Apps**:
    - **Research Repository**: Included additional content type in the results & Enhancements in analytics dashboard.
    - **DSAL**: Released to production on One Platform. Ongoing development for DSAL Dashboard.
    - **MoD Handovers**: Feedback addressed which are reported via feedback module.
  - **Component Library**:
    - **Storybook**: Basic support of storybook for the components.
- **Onboarding**:
  - Onboarding app list readiness
  - GDPR deployed on Stage
  - In conversation with Pantheon and IR Dashboard

### What's coming?

- **SPA Onboarding**

  - **GDPR**: Deploy GDPR on the Production environment.
  - **Pantheon**: Discussions underway. Timelines will be communicated in the next Jan’21 blog.
  - **Life Cycle**: Initiate the conversation with Feng Wang (fwang@redhat.com).

- **Development and Adoption Priorities**

  - **DSAL**: Stats and Ansible Dashboard development and release to users(continued). Completion of DSAL application.
  - **Feedback**: Integration with Developer Console and Explore opportunities to use Qualtrics.
  - **Notifications (impact on OKR)**: Integration with Developer Console for consistent developers experience.
  - **Developer Console (impact on OKR)**: Implementation of Developer Console SPA based upon approved UX designs. Feedback/Notifications top priority(continued)
  - **Research Repository**: Further enhancements and feature development. Completion of Research Repository application.
  - **Status Dashboard**: A simple status page for the One Platform properties (SPA/Microservices) uptime and performance.

- **One Platform Test Automation**: Automated end-to-end testing for One Platform initial set of modules, in collaboration with the QE team. Create one POD in MPaaS to deploy a test runner app created by the QA team to test infrastructure readiness.

For more updates related to One Platform, please check out the One Platform Blog at: [one.redhat.com/get-started/blog](https://one.redhat.com/get-started/blog/)

### Meta

**Completed Sprint:** OP – 21.01

**Ongoing/Upcoming Sprint:** OP - 21.02

**One Platform:** [one.redhat.com](https://one.redhat.com)

**JIRA:** [https://projects.engineering.redhat.com/projects/ONEPLAT/issues](https://projects.engineering.redhat.com/projects/ONEPLAT/issues)

**GitHub:** [https://github.com/1-Platform/one-platform/issues](https://github.com/1-Platform/one-platform/issues)

## Questions

For any questions, please reach out to One Platform team over [one-platform-devs@redhat.com](mailto:one-platform-devs@redhat.com) or ping us over [One Platform GChat Room](https://chat.google.com/room/AAAAF4M7oZE).
For more information please view [FAQs](/docs/faqs).
