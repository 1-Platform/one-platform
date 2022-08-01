---
slug: state-of-one-platform-dec-2020
title: State of One Platform - December 2020
author: Sayak Sarkar
author_title: Senior Software Engineer @ Red Hat
author_url: https://github.com/sayak-sarkar
author_image_url: https://avatars0.githubusercontent.com/u/1418735?s=400&v=4
tags: [redhat, blog, oneportal, oneplatform, react, angular, december, update]
---
### Meta
**Completed Sprint:** OP – 20.12/1

**Ongoing/Upcoming Sprint:** OP - 21.01/1

**One Platform:** [one.redhat.com](https://one.redhat.com)

**JIRA:** [https://projects.engineering.redhat.com/projects/ONEPLAT/issues](https://projects.engineering.redhat.com/projects/ONEPLAT/issues)

**GitHub:** [https://github.com/1-Platform/one-platform/issues](https://github.com/1-Platform/one-platform/issues)

### Introduction
This is a summary of the development goals achieved by the One Platform team in the month of December 2020. This month the team had the following goals:

- **Application Development:** Focus on the development of the next versions of the Feedback [/feedback](https://one.redhat.com/feedback) and One Platform Notifications applications.
- **Component Library:** Development and release of the [opc-input-chip](https://www.npmjs.com/package/@one-platform/opc-input-chip) component.

### OKRs

| OKR  | Status |
|---|---|
| **Onboard/Migrate min. 3 non-native SPAs to One Platform.** | SPAs onboarded so far: MoD Handovers, RHEL Developer Guide, Research Repository, Legacy(One Portal),  Video Library. |
| **Improve the One Platform microservice deployment speed by 500%.** | Developed OpenShift templates for quick and easy microservice deployments. |
| **Increase the speed of SPA development by creating 25 components** | Continued development and expansion of the Component Library with the addition of the new opc-input-chip component. |
| **Infrastructure maintenance and enhancements to support the One Platform** | Migration planned for One Platform QA to MPaaS. |

### Key highlights
The team was able to close 17+ JIRAs across a range of development priorities. The highlights are :

- **Application development and readiness:**
  - **Native Apps**:
    - **API Gateway**: Gateway and endpoints performance optimizations.
    - **Feedback**:
      - New SPA and Microservice development complete.
      - Feedback web component development in progress.
    - **Developer Console**: Workflow designs for all microservices finalized and implementation initiated.
    - **Notifications**: Enhancements in SPA & Microservice to support template based notifications. Implementation nearing completion for requirements of DXP Drupal Properties.
  - **Non Native Apps**:
    - **Research Repository**:
      - Dashboard enhancements, Added charts.
      - Addressed feedback from the stakeholders.
    - **Video Library**: Deployed to production at [/video-library](https://one.redhat.com/video-library) and released.
    - **DSAL**:
      - DSAL Code migration took place in December from the old One Portal codebase to an independent SPA and microservice to be deployed on One Platform.
      - Overall release status: 80%
    - **GDPR**: The GDPR App has been deployed to One Platform QA and Stage environments and is expected to be deployed to Production in the upcoming month.

- **Component Library:**
  - **Input Chip:** A new component called the [input-chip](https://www.npmjs.com/package/@one-platform/opc-input-chip) component was implemented and released.

### What's coming?

- **SPA onboarding:**
  - **GDPR:** GDPR has been deployed to the QA and Stage environments. Production release is expected to be closed by the end of Jan ’21.
  - **Pantheon:** Discussions underway. The teams are exploring the technical feasibility of migrating the backend applications.
  - **Life Cycle:** Working with stakeholders on timeline. Latest update is Feb ’21.
- **Development and Adoption Priorities**
  - **Feedback:** Integration with Developer Console and Explore opportunities to use Qualtrics.
  - **Notifications** (impact on OKR): Banner and inter-application notifications enhancements. Integration with Developer Console for consistent developers experience.
  - **Developer Console** (impact on OKR):
    - An entrypoint for developers to get started with deploying and configuring their SPAs onto One Platform.
    - Implementation of Developer Console SPA based upon approved UX designs.
- **QA Migration:** QA Instance migration to MPaaS.
- **One Platform Test Automation:** Automated end-to-end testing for One Platform. In collaboration with the QE team.

For more updates related to One Platform, please check out the One Platform Blog at: [one.redhat.com](https://one.redhat.com/get-started/blog)
## Questions

For any questions, please reach out to One Platform team over [one-platform-devs@redhat.com](mailto:one-platform-devs@redhat.com) or ping us over [One Platform GChat Room](https://chat.google.com/room/AAAAF4M7oZE).
For more information please view [FAQs](/docs/faqs).
