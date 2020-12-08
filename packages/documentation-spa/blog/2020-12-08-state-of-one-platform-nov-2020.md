---
id: state-of-one-platform-nov-2020
title: State of One Platform - November 2020
author: Sayak Sarkar
author_title: Senior Software Engineer @ Red Hat
author_url: https://github.com/sayak-sarkar
author_image_url: https://avatars0.githubusercontent.com/u/1418735?s=400&v=4
tags: [redhat, blog, oneportal, oneplatform, react, angular, november, update]
---
### Meta
**Completed Sprint:** OP – 20.11/1

**Ongoing/Upcoming Sprint:** OP - 20.12/1

**One Platform:** [one.redhat.com](https://one.redhat.com)

**JIRA:** [https://projects.engineering.redhat.com/projects/ONEPLAT/issues](https://projects.engineering.redhat.com/projects/ONEPLAT/issues)

**GitHub:** [https://github.com/1-Platform/one-platform/issues](https://github.com/1-Platform/one-platform/issues)

### Introduction
This is a quick summary of the development goals achieved by the One Platform team in the month of November 2020. This month the team had the following goals:

- **One Portal Migration:** Migrate the One Portal application to One Platform as a set of legacy applications under the ‘[/legacy](https://one.redhat.com/legacy)’ route.
- **One Platform Production Release:** Deploy One Platform to the production environment on [one.redhat.com](https://one.redhat.com).
- **Application development and readiness:** SPAs, Microservices and APi Gateway.
- **Component Library:** Continue development of new components as per requirements and enhance existing components.

### Key highlights
During the sprint of November 2020, the team was able to close over 50 JIRAs across a range of development priorities. Here are the key highlights from this month’s sprint as per the development goals for this month:

- **One Portal Migration:**
  - Clean up all deprecated applications within the One Portal Application
  - Deploy the One Portal application to the ‘[/legacy](https://one.redhat.com/legacy)’ path.
  - Test all legacy applications for any broken functionality.
  - Fix all broken functionality and optimize Legacy for One Platform

- **One Platform Production Release:**
  - Setup Managed PaaS infrastructure under the CPOPS organization.
  - Deploy all platform microservices to MPaaS.
  - Remap DNS for [one.redhat.com](https://one.redhat.com) to point to the MPaaS production instance.

- **Application development and readiness:**
  - **API Gateway**: Implement API Key based auth with permission management.
  - **Search**: Search service was implemented and deployed to production.
  - **DSAL**: Core application components are now ready for deployment to One Platform with 50% overall use-cases being now ready for migration and testing in progress.
  - **Feedback**: Dynamic target integration completed with Gitlab, Jira with enhancements and bug fixes for the SPA.
  - **Research Repository**: Application deployment to One Platform production environment with UI enhancements and an analytics dashboard.
  - **Video Library**: Integration with the user service for highlighting user details for videos.
  - **Developer Console**: Workflow designs finalized and implementation initiated.
  - **Notifications**: Enhancements and new functionalities implemented for SPA as well as microservice. Development work initiated for Notifications configuration management using developer console.
  - **MoD Handovers**: SPA and microservice along with the MoD scripts and databases migrated to One Platform and deployed on production with enhancements and bug fixes.
  - **User Groups and Authorization**: Enhancements implemented to better integrate the User Groups Microservice with the Authorization microservice.

- **Component Library:**
  - **Back to Top:** The back-to-top component was enhanced and updated.
  - **Timeline:** A new component called the timeline component was implemented and released.

### What's coming?

- **SPA onboarding:**
  - **DSAL:** Development and migration work nearing completion.
  - **GDPR:** GDPR team waiting on IT for SSO update.
  - **Pantheon:** Discussions underway.
  - **Development and Adoption Priorities**
    - **Feedback:** Enhanced Microservice and SPA functionalities as per customer requirements. Configuration management using Developer Console.
    - **Notifications:** Improvements to banner and interapplication notifications. Notifications and subscription management using Developer Console.
    - **Developer Console:** Implementation of Developer Console SPA based upon approved UX designs. Configuration management priorities include Feedback and Notifications.
    - **Video Library:** Migration from the legacy platform with improved UI and UX enhancements.
    - **Research Repository:** Further enhancements and feature development
    - **One Platform Test Automation:** Automated end-to-end testing for One Platform. In collaboration with the QE team.

For more updates related to One Platform, please check out the One Platform Blog at: [one.redhat.com](https://one.redhat.com/get-started/blog)

## Questions

For any questions, please reach out to One Platform team over [one-portal-devel@redhat.com](mailto:one-portal-devel@redhat.com) or ping us over [One Platform GChat Room](https://chat.google.com/room/AAAAF4M7oZE).
For more information please view [FAQs](/docs/faqs).
