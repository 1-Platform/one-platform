import { LitElement, html } from "lit";
import { customElement } from "lit/decorators.js";

import style from "./opc-avatar.styles";

@customElement("opc-avatar")
export class OpcAvatar extends LitElement {
  static styles = style;

  render() {
    return html`
      <div class="opc-menu-drawer__avatar">
        <slot></slot>
      </div>
    `;
  }
}
