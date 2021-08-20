import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";

import style from "./opc-filter-chip.styles";

@customElement("opc-filter-chip")
export class OpcFilterChip extends LitElement {
  static styles = style;

  @property({ type: Boolean }) isChipActive = false;

  render() {
    return html`
      <button
        class="opc-notification-drawer__header-chip"
        ?active=${this.isChipActive}
        name="filter-chip"
        aria-label="filter-chip"
      >
        <slot></slot>
      </button>
    `;
  }
}
