import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import style from "./opc-toast.styles";
import dayjs from "dayjs/esm";
import { Notification, ToastOptions } from "./types";

@customElement("opc-toast")
export class OpcToast extends LitElement {
  static styles = style;

  @property({ type: Object, reflect: true }) options!: ToastOptions;
  @property({ type: Object, reflect: true }) notification!: Notification;

  @property()
  get toastRef() {
    return this.renderRoot.querySelector("pfe-toast")!;
  }

  render() {
    return html`
      <pfe-toast
        auto-dismiss=${this.options.duration}
        class="op-menu-drawer__notification-toast"
        variant="${this.options.variant}"
        @pfe-toast:close=${(event: Event) => {
          this.remove();
        }}
      >
        <span
          class="op-menu-drawer__notification-time"
          title="${dayjs(this.notification.sentOn).format("LLL")}"
          >just now</span
        >
        <h5 class="op-menu-drawer__notification-subject">
          ${this.notification.link
            ? `<a href="${this.notification.link}">${this.notification.subject}</a>`
            : this.notification.subject}
        </h5>
        <p
          style="display: ${!!this.notification.body ? "block" : "none"};"
          class="op-menu-drawer__notification-body"
        >
          ${this.notification.body}
        </p>
      </pfe-toast>
    `;
  }
}
