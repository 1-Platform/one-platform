---
slug: state-of-one-platform-nov-2020
title: State of One Platform - November 2020
authors: sayak
tags: [redhat, blog, oneportal, oneplatform, react, angular, november, update]
---

This is a summary of the development goals achieved by the One Platform team in the month of **November 2020**. This month the team had the following goals:

<!--truncate-->

- **One Platform Production Release:** Deploy One Platform to the production environment on [one.redhat.com](https://one.redhat.com).
- **Application development and readiness and Component Library** ([opc-back-to-top](https://www.npmjs.com/package/@one-platform/opc-back-to-top) and [opc-timeline component](https://www.npmjs.com/package/@one-platform/opc-timeline)).
- **One Portal Migration:** Migrated under the [/legacy](https://one.redhat.com/legacy) route.

### OKRs

| OKR                                                                     | Status                                                                                                   |
| ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| **One Platform readiness for in-built SPAs and onboarding developers.** | Developed & Released 4 foundational SPAs and Microservices (Notification, Feedback, User Group and Home) |
| **Onboarding 3 New SPAs**                                               | SPAs Onboarded: MoD Handovers, RHEL Developer Guide, Research Repository.                                |

### Key highlights

The team was able to close 50+ JIRAs across a range of development priorities. The highlights are :

- **One Platform Production Release:**

  - Setup Managed PaaS infrastructure under the CPOPS organization.
  - Deploy all platform microservices to MPaaS.

- **Application development and readiness:**

  - **Native Apps**:
    - **API Gateway**: API Key based auth with permission management.
    - **Search**: Implemented and deployed in collaboration with the Search Platform Team.
    - **Feedback**: Dynamic target integration with Gitlab, JIRA ready to use.
    - **Developer Console**: Workflow designs finalized and implementation initiated.
    - **Notifications**: Enhancements in SPA & Microservice. Implementation underway for requirements of DXP Drupal Properties.
    - **User Groups and Authorization**: Enhancements implemented.
  - **Non Native Apps**:
    - **Research Repository**: Deployed. Focused on UI & analytics dashboard.
    - **Video Library**: Integration with the user service to highlight user details.
    - **DSAL**: Core application components are ready for deployment with 50% overall use-cases. Testing in progress.
    - **MoD Handovers**: Deployed in Production with enhancements.

- **Component Library:**

  - **Back to Top:** The back-to-top component was enhanced and updated.
  - **Timeline:** A new component called the [timeline](https://www.npmjs.com/package/@one-platform/opc-timeline) component was implemented and released.

- **One Portal Migration:**
  - Clean-up of all deprecated applications and test remaining legacy applications for any broken functionality to fix. Migrated under the [/legacy](https://one.redhat.com/legacy) route.

### What's coming?

- **SPA onboarding:**
  - **DSAL:** Deployed on Stage. Production migration expected by 11th Dec.
  - **GDPR:** GDPR team waiting on IT for SSO update. Expected to be closed by the end of Jan’21.
  - **Pantheon:** Discussions underway. Timelines will be communicated in the next Dec’20 blog.
  - **Life Cycle:** Working with stakeholders on timeline. Latest update is Jan’21.
- **Development and Adoption Priorities**
  - **Feedback:** Enhanced Microservice and SPA functionalities, Integration with Developer Console and Explore opportunities to use Qualtrics.
  - **Notifications** (impact on OKR): Banner and inter-application notifications enhancements. Integration with Developer Console for consistent developers experience.
  - **Developer Console** (impact on OKR): Implementation of Developer Console SPA based upon approved UX designs. Feedback/Notifications top priority.
  - **Video Library:** Release on Platform scheduled for 15th Dec.
  - **Research Repository:** Further enhancements and feature development
- **One Platform Test Automation:** Automated end-to-end testing for One Platform. In collaboration with the QE team.

For more updates related to One Platform, please check out the One Platform Blog at: [one.redhat.com](https://one.redhat.com/get-started/blog)

### Meta

**Completed Sprint:** OP – 20.11/1

**Ongoing/Upcoming Sprint:** OP - 20.12/1

**One Platform:** [one.redhat.com](https://one.redhat.com)

**JIRA:** [https://projects.engineering.redhat.com/projects/ONEPLAT/issues](https://projects.engineering.redhat.com/projects/ONEPLAT/issues)

**GitHub:** [https://github.com/1-Platform/one-platform/issues](https://github.com/1-Platform/one-platform/issues)

## Questions

For any questions, please reach out to One Platform team over [one-portal-devel@redhat.com](mailto:one-portal-devel@redhat.com) or ping us over [One Platform GChat Room](https://chat.google.com/room/AAAAF4M7oZE).
For more information please view [FAQs](/docs/faqs).
