import { OpcDrawerFooter } from "./opc-drawer-footer";

import { fixture, assert, expect } from "@open-wc/testing";
import { html } from "lit/static-html.js";

const COMPONENT_TAG = "opc-drawer-footer";

suite(COMPONENT_TAG, () => {
  test("is defined", () => {
    const el = document.createElement(COMPONENT_TAG);
    assert.instanceOf(el, OpcDrawerFooter);
  });

  test("should render properly", async () => {
    const el = await fixture(html`<opc-drawer-footer></opc-drawer-footer>`);
    assert.shadowDom.equal(
      el,
      `
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
     `
    );
  });

  test("has no axe violations", async () => {
    const el = await fixture(html`<opc-drawer-footer></opc-drawer-footer>`);
    expect(el).to.be.accessible();
  });
});
