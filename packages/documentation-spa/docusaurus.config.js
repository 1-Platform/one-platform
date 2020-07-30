module.exports = {
  title: 'One Portal',
  tagline: 'One Portal is an integrated applications hosting platform which allows you to host your SPAs while taking advantage of in-built Components, Microservices and Assets. ',
  url: 'https://beta.one.redhat.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  favicon: 'img/favicon.ico',
  organizationName: '1-platform', // Usually your GitHub org/user name.
  projectName: '1-platform.github.io', // Usually your repo name.
  themeConfig: {
    navbar: {
      title: ' ',
      logo: {
        alt: 'Red Hat One Portal Logo',
        src: 'img/logo.svg',
        srcDark: 'img/logo_dark.svg',
      },
      items: [
        {
          to: 'docs/',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left',
        },
        {to: 'blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/1-platform/one-platform',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Quick Links',
          items: [
            {
              label: 'One Platform in Mojo',
              href: 'https://mojo.redhat.com/groups/pnt-devops/projects/one-portal',
            },
            {
              label: 'Weekly Blog',
              to: 'blog',
            },
            {
              label: 'Contact Us',
              href: 'https://beta.one.redhat.com/contact-us.html',
            },
          ],
        },
        {
          title: 'Related Sites',
          items: [
            {
              label: 'Red Hat Access',
              href: 'https://access.redhat.com',
            },
            {
              label: 'Catalog',
              href: 'https://catalog.redhat.com',
            },
            {
              label: 'Connect',
              href: 'https://connect.redhat.com',
            },
          ],
        },
        {
          title: 'Help',
          items: [
            {
              label: 'Report an Issue',
              href: 'https://beta.one.redhat.com/feedback',
            },
            {
              label: 'FAQs',
              to: 'docs/faqs',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Red Hat, Inc.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          // It is recommended to set document id as docs home page (`docs/` path).
          homePageId: 'doc1',
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl:
            'https://github.com/1-platform/one-platform/edit/master/packages/documentation-spa/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/1-platform/one-platform/edit/master/packages/documentation-spa/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
