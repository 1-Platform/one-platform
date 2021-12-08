import { OpcToast } from "./opc-toast";
import { fixture, assert, expect } from "@open-wc/testing";
import { html } from "lit/static-html.js";

const COMPONENT_TAG = "opc-toast";

const mock = {
  toastOptions: {
    addToDrawer: false,
    duration: "5s",
    variant: "success",
  },
  notificationOptions: {
    subject: "Hello",
    body: "World",
    sentOn: "2021-12-07T15:27:46.139Z",
    link: "",
  },
};

suite(COMPONENT_TAG, () => {
  test("is defined", () => {
    const el = document.createElement(COMPONENT_TAG);
    assert.instanceOf(el, OpcToast);
  });

  test("should render properly", async () => {
    const el = await fixture(html`<opc-toast
      .notification=${mock.notificationOptions}
      .options=${mock.toastOptions}
    ></opc-toast>`);
    assert.shadowDom.equal(
      el,
      `
     <pfe-toast
        auto-dismiss="${mock.toastOptions.duration}"
        class="op-menu-drawer__notification-toast"
        variant="${mock.toastOptions.variant}"
      >
        <span
          class="op-menu-drawer__notification-time"
          title="LLL"
          >just now</span
        >
        <h5 class="op-menu-drawer__notification-subject">
          ${mock.notificationOptions.subject}
        </h5>
        <p
          style="display: block;"
          class="op-menu-drawer__notification-body"
        >
          ${mock.notificationOptions.body}
        </p>
      </pfe-toast>
     `
    );
  });

  test("has no axe violations", async () => {
    const el = await fixture(html`<opc-toast
      .notification=${mock.notificationOptions}
      .options=${mock.toastOptions}
    ></opc-toast>`);
    expect(el).to.be.accessible();
  });
});
