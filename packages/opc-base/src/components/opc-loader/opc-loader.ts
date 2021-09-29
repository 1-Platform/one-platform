import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import style from "./opc-loader.styles";

@customElement("opc-loader")
export class OpcLoader extends LitElement {
  static styles = style;

  @property({ type: Boolean }) hidden = false;

  // to avoid overflow scroll
  willUpdate(changedProperties: Map<string, unknown>): void  {
    if (changedProperties.has("hidden")) {
      document.body.style.overflowY = this.hidden ? "auto" : "hidden";
    }
  }

  render() {
    return html`
      <div class="opc-loader__container" hidden=${this.hidden}>
        <span class="opc-loader">L &nbsp; ading</span>
      </div>
    `;
  }
}
