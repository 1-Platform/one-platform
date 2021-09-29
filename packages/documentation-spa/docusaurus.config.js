module.exports = {
  title: 'One Portal',
  tagline: 'One Portal is an integrated applications hosting platform which allows you to host your SPAs while taking advantage of in-built Components, Microservices and Assets. ',
  url: 'https://beta.one.redhat.com',
  baseUrl: '/get-started/',
  onBrokenLinks: 'throw',
  favicon: 'img/favicon.ico',
  organizationName: '1-platform',
  projectName: '1-platform.github.io',
  themeConfig: {
    // announcementBar: {
    //   id: 'support_us', // Any value that will identify this message.
    //   content: 'We are looking to revamp our docs, please fill <a target="_blank" rel="noopener noreferrer" href="#">this survey</a>',
    //   backgroundColor: '#fafbfc', // Defaults to `#fff`.
    //   textColor: '#091E42', // Defaults to `#000`.
    // },
    prism: {
      defaultLanguage: 'javascript',
      theme: require('prism-react-renderer/themes/github'),
      darkTheme: require('prism-react-renderer/themes/dracula')
    },
    colorMode: {
      // "light" | "dark"
      defaultMode: 'light',

      // Hides the switch in the navbar
      // Useful if you want to support a single color mode
      disableSwitch: true
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'QUICK LINKS',
          items: [
            {
              label: 'One Platform in Source',
              href: 'https://source.redhat.com/groups/public/exd-digital-experience-platforms/exd_digital_experience_platforms_dxp_blog/part_i_why_one_platform_to_host_your_applications'
            },
            {
              label: 'Monthly Blog',
              to: 'blog'
            },
            {
              label: 'Contact Us',
              href: 'https://beta.one.redhat.com/contact-us.html'
            }
          ]
        },
        {
          title: 'RELATED SITES',
          items: [
            {
              label: 'Red Hat Access',
              href: 'https://access.redhat.com'
            },
            {
              label: 'Catalog',
              href: 'https://catalog.redhat.com'
            },
            {
              label: 'Connect',
              href: 'https://connect.redhat.com'
            }
          ]
        },
        {
          title: 'HELP',
          items: [
            {
              label: 'Report an Issue',
              href: 'https://beta.one.redhat.com/feedback'
            },
            {
              label: 'FAQs',
              to: 'docs/faqs'
            }
          ]
        }
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Red Hat, Inc.`
    }
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/1-platform/one-platform/edit/master/packages/documentation-spa/'
        },
        blog: {
          showReadingTime: true,
          editUrl:
            'https://github.com/1-platform/one-platform/edit/master/packages/documentation-spa/blog/'
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css')
        }
      }
    ]
  ]
}
