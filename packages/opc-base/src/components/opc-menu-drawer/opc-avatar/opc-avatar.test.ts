import { OpcAvatar } from "./opc-avatar";

import { fixture, assert, expect } from "@open-wc/testing";
import { html } from "lit/static-html.js";

const COMPONENT_TAG = "opc-avatar";

suite(COMPONENT_TAG, () => {
  test("is defined", () => {
    const el = document.createElement(COMPONENT_TAG);
    assert.instanceOf(el, OpcAvatar);
  });

  test("should render properly", async () => {
    const el = await fixture(html`<opc-avatar></opc-avatar>`);
    assert.shadowDom.equal(
      el,
      `
      <div class="opc-menu-drawer__avatar">
        <slot></slot>
      </div>
     `
    );
  });

  test("has no axe violations", async () => {
    const el = await fixture(html`<opc-avatar></opc-avatar>`);
    expect(el).to.be.accessible();
  });
});
