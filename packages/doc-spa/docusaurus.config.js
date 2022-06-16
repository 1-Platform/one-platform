// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");
require("dotenv-safe").config();

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "One Platform",
  tagline:
    "One Portal is an integrated applications hosting platform which allows you to host your SPAs while taking advantage of in-built Components, Microservices and Assets.",
  url: "https://one.redhat.com",
  baseUrl: "/get-started/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  organizationName: "1-platform", // Usually your GitHub org/user name.
  projectName: "op-doc", // Usually your repo name.
  plugins: ["docusaurus-plugin-sass"],
  customFields: {
    // Put your custom environment here
    opcBaseAPIBasePath: process.env.REACT_APP_OPCBASE_API_BASE_PATH,
    opcBaseSubscriptionPath:
      process.env.REACT_APP_OPCBASE_SUBSCRIPTION_BASE_PATH,
    opcBaseKeycloakURL: process.env.REACT_APP_OPCBASE_KEYCLOAK_URL,
    opcBaseKeycloakClientID: process.env.REACT_APP_OPCBASE_KEYCLOAK_CLIENT_ID,
    opcBaseKeycloakRealm: process.env.REACT_APP_OPCBASE_KEYCLOAK_REALM,
    sentryDSN: process.env.REACT_APP_SENTRY_DSN,
  },
  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          // Please change this to your repo.
          editUrl:
            "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            "https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/",
        },
        theme: {
          customCss: [require.resolve("./src/css/custom.scss")],
        },
      }),
    ],
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        logo: {
          alt: "My Site Logo",
          src: "img/logo.svg",
        },
        items: [
          { to: "/blog", label: "Blog", position: "left" },
          {
            href: "https://github.com/facebook/docusaurus",
            label: "GitHub",
            position: "right",
          },
        ],
      },
      colorMode: {
        // "light" | "dark"
        defaultMode: "light",

        // Hides the switch in the navbar
        // Useful if you want to support a single color mode
        disableSwitch: true,
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "QUICK LINKS",
            items: [
              {
                label: "One Platform in Source",
                href: "https://source.redhat.com/groups/public/exd-digital-experience-platforms/exd_digital_experience_platforms_dxp_blog/part_i_why_one_platform_to_host_your_applications",
              },
              {
                label: "Monthly Blog",
                to: "blog",
              },
              {
                label: "Contact Us",
                href: "https://one.redhat.com/contact-us",
              },
            ],
          },
          {
            title: "RELATED SITES",
            items: [
              {
                label: "Red Hat Access",
                href: "https://access.redhat.com",
              },
              {
                label: "Catalog",
                href: "https://catalog.redhat.com",
              },
              {
                label: "Connect",
                href: "https://connect.redhat.com",
              },
            ],
          },
          {
            title: "HELP",
            items: [
              {
                label: "Report an Issue",
                href: "https://one.redhat.com/feedback",
              },
              {
                label: "FAQs",
                to: "docs/faqs",
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Red Hat, Inc.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
