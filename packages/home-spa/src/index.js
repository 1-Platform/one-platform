// @ts-nocheck
// SCSS imports
import './index.scss';
// Webcomponents
import '@one-platform/opc-footer/dist/opc-footer';
// Local javascript imports
import * as FooterLinks from '../../common/footer.json';
import { renderSPAList } from './404/404';
import { contactUsTeamBlock } from './contact-us/contact-us';
import { microserviceCards, applicationCards, renderSidebar, renderMain } from './home/home';
// Service function import
import { getData, getHomeTypeBySPA }  from './service/service';

// #region footer
const footer = document.querySelector('footer');
if (footer !== null) {
  footer.innerHTML = `
  <opc-footer theme="dark" id="darkFooterWithLinks">
    <span slot="copyright">
      Red Hat Inc. Internal Use Only.
    </span>
  </opc-footer>`;
}

const links = FooterLinks.default;
const opcFooter = document.querySelector('opc-footer');
opcFooter.opcLinkCategories = links;

opcFooter.addEventListener( 'opc-footer-link:click', () => {
  document.querySelector('opc-feedback').toggle();
}, false);
// #endregion footer

document.addEventListener( 'DOMContentLoaded', () => {
  document.querySelector( 'body' ).style.visibility = 'visible'
} );

window.OpAuthHelper.onLogin(() => {
  getData(getHomeTypeBySPA)
    .then((result) => {
      const apps = result.data.apps ? result.data.apps : [];
      localStorage.setItem("spaList", JSON.stringify(apps));
      microserviceCards();
      renderMain();
      applicationCards(apps);
      renderSPAList(apps);
      renderSidebar();
      contactUsTeamBlock();
    })
    .catch((err) => {
      console.error(err);
    });
});
