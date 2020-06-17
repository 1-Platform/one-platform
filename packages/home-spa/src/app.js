// @ts-nocheck
// SCSS imports
import './styles/main.scss';
// NPM lib imports
import '@patternfly/pfe-card/dist/pfe-card.min.js';
import '@patternfly/pfe-cta/dist/pfe-cta.min.js';
import '@patternfly/pfe-tabs/dist/pfe-tabs.min.js';
// Local javascript imports
import './js/controller.js';

// Common HTML -> footer and band 
const footer = document.querySelector('footer');
const band = document.querySelector('#band');
if (footer !== null) {
    footer.innerHTML = `
    <div class="container footer">
    <div class="footer__links-col">
      <div class="footer__links-header">
        Quick links
      </div>
      <div class="footer__links">
        <a href="https://mojo.redhat.com/groups/pnt-devops/projects/one-portal/" rel="noreferrer" target="_blank">One Platform in Mojo</a>
        <a href="https://mojo.redhat.com/groups/pnt-devops/projects/one-portal/blog/" rel="noreferrer" target="_blank">Weekly Blog</a>
        <a href="contact-us.html">Contact Us</a>
      </div>
    </div>
    <div class="footer__links-col">
      <div class="footer__links-header">
        Related sites
      </div>
      <div class="footer__links">
        <a href="https://access.redhat.com/" rel="noreferrer" target="_blank">access.redhat.com</a>
        <a href="https://catalog.redhat.com/" rel="noreferrer" target="_blank">catalog.redhat.com</a>
        <a href="https://connect.redhat.com/" rel="noreferrer" target="_blank">connect.redhat.com</a>
      </div>
    </div>
    <div class="footer__links-col">
      <div class="footer__links-header">
        Help
      </div>
      <div class="footer__links">
        <a id="fileFeedback" rel="noreferrer" target="_blank">Report an Issue</a>
        <a href="https://mojo.redhat.com/docs/DOC-1225598" rel="noreferrer" target="_blank">One Portal FAQs</a>
        <a href="mailto:one-portal@redhat.com">one-portal@redhat.com</a>
        <a href="https://github.com/1-platform/one-platform" rel="noreferrer" target="_blank">GitHub</a>
      </div>
    </div>
  </div>
  <div class="footer__copyright">
    Copyright &copy; 2020 Red Hat Inc. Internal Use Only
  </div>`;
}

if (band !== null) {
  band.innerHTML = `
  <div class="band__header">
    Join the One Platform Digital Experience!
  </div>
  <a class="band__button--primary-border" target="_blank" href="https://docs.google.com/document/d/1T7aDUNIWd7vgD3F3lSQg06iYs964G6PvvgUtIbk9RmQ/" rel="noopener noreferrer">
    Onboarding Guide
  </a>`;
}

const feedbackToggle = document.querySelector('#fileFeedback');

feedbackToggle.addEventListener('click', () => {
  document.querySelector("op-feedback").togglePanelVisibility();
}, false);
