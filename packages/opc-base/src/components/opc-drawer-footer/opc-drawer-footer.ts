import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

import style from "./opc-drawer-footer.styles";

@customElement("opc-drawer-footer")
export class OpcDrawerFooter extends LitElement {
  static styles = style;

  render() {
    return html`
      <div class="opc-footer__container">
        <div class="opc-footer__section">
          <a href="#">How One Platform works?</a>
        </div>
        <div class="opc-footer__section">
          <div><a href="/get-started/docs">Docs</a></div>
          <div><a href="/get-started/blog">Blogs</a></div>
          <div><a href="/contact-us">Contact Us</a></div>
        </div>
        <div class="opc-footer__section">
          <span class="opc-footer__copyright"> © 2021 RedHat Inc. </span>
        </div>
      </div>
    `;
  }
}
