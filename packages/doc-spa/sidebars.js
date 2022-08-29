/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docs: [
    {
      type: "category",
      label: "Get Started",
      collapsed: false,
      items: ["getting-started/overview", "getting-started/op-architecture"],
    },
    {
      type: "category",
      label: "Services",
      collapsed: false,
      items: [
        "services/op-service-overview",
        {
          type: "category",
          label: "Apps Service",
          items: [
            "services/apps-service/overview",
            "services/apps-service/guides",
            "services/apps-service/api-ref",
            "services/apps-service/faqs",
          ],
        },
        {
          type: "category",
          label: "API Catalog",
          items: [
            "services/api-catalog/overview",
            "services/api-catalog/guides",
            "services/api-catalog/api-ref",
            "services/api-catalog/faqs",
          ],
        },
        {
          type: "category",
          label: "Developer Console",
          items: [
            "services/developer-console/overview",
            "services/developer-console/guides",
            "services/developer-console/api-ref",
            "services/developer-console/faqs",
          ],
        },
        {
          type: "category",
          label: "Feedback Service",
          items: [
            "services/feedback/overview",
            "services/feedback/guides",
            "services/feedback/api-ref",
            "services/feedback/faqs",
          ],
        },
        {
          type: "category",
          label: "Lighthouse",
          items: [
            "services/lighthouse/overview",
            "services/lighthouse/guides",
            "services/lighthouse/api-ref",
            "services/lighthouse/faqs",
          ],
        },
        {
          type: "category",
          label: "Notification Service",
          items: [
            "services/notification/overview",
            "services/notification/guides",
            "services/notification/api-ref",
            "services/notification/faqs",
          ],
        },
        {
          type: "category",
          label: "Search Service",
          items: [
            "services/search/overview",
            "services/search/guides",
            "services/search/api-ref",
            "services/search/faqs",
          ],
        },
        {
          type: "category",
          label: "User Group",
          items: [
            "services/user-group/overview",
            "services/user-group/guides",
            "services/user-group/api-ref",
            "services/user-group/faqs",
          ],
        },
      ],
    },
    {
      type: "category",
      label: "Component Library",
      collapsed: false,
      items: [
        "component-library/component-lib-overview",
        "component-library/opc-base",
      ],
    },
    {
      type: "category",
      label: "Deployment Guidelines",
      collapsed: false,
      items: [
        "deployment-guidelines/spa-deployment-guideline",
        "deployment-guidelines/service-deployment-guideline",
      ],
    },
    {
      type: "category",
      label: "Contributing",
      collapsed: false,
      items: ["contributing/how-to-contribute", "contributing/code-of-conduct"],
    },
    {
      type: "doc",
      id: "faqs",
    },
  ],
};

module.exports = sidebars;
