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
import * as FooterLinks from '../../common/footer.json';
import * as Blog from '../../common/blogs.json';

// Common HTML -> footer and band
const footer = document.querySelector('footer');
const band = document.querySelector('#band');
if (footer !== null) {
  footer.innerHTML = `
  <opc-footer theme="dark" id="darkFooterWithLinks">
    <span slot="copyright">
      Red Hat Inc. Internal Use Only.
    </span>
  </opc-footer>`;
}

if (band !== null) {
  band.innerHTML = `
  <div class="band__items">
			<div class="band__text">
        <h1> Join the One Platform Digital Experience! </h1>
        <p>
          One Portal provides a single place for all internal applications and services,
          supports consistent User experience by providing standard platform for service hosting and data integration,
          efficient
        </p>
      </div>
      <button id="open-documentation-modal">
        Documentation
      </button>
      <a class="pf-c-button pf-m-danger" target="_blank" href="https://docs.google.com/document/d/1T7aDUNIWd7vgD3F3lSQg06iYs964G6PvvgUtIbk9RmQ/" rel="noopener noreferrer">
        Onboarding Guide
      </a>
  </div>`;
}

const links = FooterLinks.default;
const opcFooter = document.querySelector('opc-footer');
opcFooter.opcLinkCategories = links;

opcFooter.addEventListener( 'opc-footer-link:click', () => {
  document.querySelector("op-feedback").togglePanelVisibility();
}, false);




const documentationModal = document.querySelector('#documentation-modal');
const openDocumentationModal = document.querySelector('#open-documentation-modal');
const blogList = document.querySelector('#blog-list');
const closeModal = document.querySelector('#modal-close');
const blogItems = Blog.default;
if (blogList !== null) {
  blogList.innerHTML = `
    ${blogItems.map(item => `
    <a class="documentation-modal__blog-list-item" href="${item.blogLink}">
      <h3>
        ${item.name}
      </h3>
      <p>${item.date}</p>
      <div class="profile">
        <img src="${item.authorImg === 'female'? 'img/user-female.svg': 'img/user-male.svg'}" alt="${item.authorImg}">
        <section>
          <h4>${item.authorName}</h4>
          <span>${item.authorPosition}</span>
        </section>
      </div>
    </a>`)
    .join('')}
    <a class="documentation-modal__blog-list-all-blogs" href="/get-started/blog/">
      <h3>
        View All blogs
      </h3>
    </a>`;
}
openDocumentationModal.onclick = () => {
  documentationModal.style.display = 'block';
}

closeModal.onclick = () => {
  documentationModal.style.display = 'none';
}

window.onclick = (Event) => {
  if (Event.target === documentationModal) {
    documentationModal.style.display = 'none';
  }
}
