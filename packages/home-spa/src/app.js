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
        <a href="https://mojo.redhat.com/groups/pnt-devops/projects/one-portal/">One Platform in Mojo</a>
        <a href="https://mojo.redhat.com/groups/pnt-devops/projects/one-portal/blog/">Weekly Blog</a>
        <a href="contact-us.html">Contact Us</a>
        <a href="#">Changelog</a>
        <a href="#">Subscribe to One Portal List</a>
      </div>
    </div>
    <div class="footer__links-col">
      <div class="footer__links-header">
        Related sites
      </div>
      <div class="footer__links">
        <a href="#">PnT Help</a>
        <a href="#">PnT DevOps (Mojo)</a>
        <a href="#">PnT Stats</a>
        <a href="#">Projects Engineering</a>
      </div>
    </div>
    <div class="footer__links-col">
      <div class="footer__links-header">
        Help
      </div>
      <div class="footer__links">
        <a href="#">One Portal FAQs</a>
        <a href="#">File an Issue</a>
        <a href="mailto:one-portal-devel@redhat.com">one-portal-devel@redhat.com</a>
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
    <button class="band__button--primary-border">Get Started</button>`;
  }