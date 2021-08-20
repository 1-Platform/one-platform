import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import style from "./opc-loader.styles";

@customElement("opc-loader")
export class OpcLoader extends LitElement {
  static styles = style;

  @property({ type: Boolean }) isOpen = false;

  render() {
    return html`
      <div class="opc-loader__container" .hidden=${this.isOpen}>
        <span class="opc-loader">L &nbsp; ading</span>
      </div>
    `;
  }
}
