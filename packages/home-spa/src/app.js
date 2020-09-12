// @ts-nocheck
// SCSS imports
import './styles/main.scss';
// NPM lib imports
import '@patternfly/pfe-card/dist/pfe-card.min.js';
import '@patternfly/pfe-cta/dist/pfe-cta.min.js';
import '@patternfly/pfe-tabs/dist/pfe-tabs.min.js';
import '@one-platform/opc-footer/dist/opc-footer';
// Local javascript imports
import './js/controller.js';

// Common HTML -> footer and band
const footer = document.querySelector('footer');
const band = document.querySelector('#band');
if (footer !== null) {
  footer.innerHTML = `<opc-footer theme="dark" id="darkFooterWithLinks"></opc-footer>`;
}

if (band !== null) {
  band.innerHTML = `
  <div class="band__items">
			<div class="band__text">
      <h1> Join the One Platform Digital Experience! </h1>
      <p>One Portal provides a single place for all internal applications and services, supports consistent User experience by providing standard platform for service hosting and data integration, efficient </p>
    </div>
    <a class="pf-c-button pf-m-danger" target="_blank" href="https://docs.google.com/document/d/1T7aDUNIWd7vgD3F3lSQg06iYs964G6PvvgUtIbk9RmQ/" rel="noopener noreferrer">
      Onboarding Guide
    </a>
    </div>`;
}

const links = [
  {
    category: 'Quick Links',
    links: [
      { text: 'One Platform in Mojo', href: 'https://mojo.redhat.com/groups/pnt-devops/projects/one-portal/' },
      { text: 'Weekly Blog', href: 'https://mojo.redhat.com/groups/pnt-devops/projects/one-portal/blog/' },
      { text: 'Contact Us', href: '/contact-us' },
    ]
  },
  {
    category: 'Related sites',
    links: [
      { text: 'access.redhat.com', href: 'https://access.redhat.com/' },
      { text: 'catalog.redhat.com', href: 'https://catalog.redhat.com/' },
      { text: 'connect.redhat.com', href: 'https://connect.redhat.com/' },
    ]
  },
  {
    category: 'Help',
    links: [
      { text: 'Report An Issue' },
      { text: 'One Portal FAQs', href: 'https://mojo.redhat.com/docs/DOC-1225598' },
      { text: 'one-portal@redhat.com', href: 'mailto:one-portal@redhat.com' },
      { text: 'GitHub', href: 'https://github.com/1-platform/one-platform' }
    ]
  },
];
const opcFooter = document.querySelector('opc-footer');
opcFooter.opcLinkCategories = links;

opcFooter.addEventListener( 'click', () => {
  document.querySelector("op-feedback").togglePanelVisibility();
}, false);
