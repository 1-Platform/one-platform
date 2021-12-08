import { OpcLoader } from "./opc-loader";

import { fixture, assert, expect } from "@open-wc/testing";
import { html } from "lit/static-html.js";

const COMPONENT = "opc-loader";

suite(COMPONENT, () => {
  test("is defined", () => {
    const el = document.createElement(COMPONENT);
    assert.instanceOf(el, OpcLoader);
  });

  test("should render properly", async () => {
    const el = await fixture(html`<opc-loader></opc-loader>`);
    assert.shadowDom.equal(
      el,
      `
       <div class="opc-loader__container">
        <span class="opc-loader">L &nbsp; ading</span>
      </div>
     `
    );
  });

  test("has no axe violations", async () => {
    const el = await fixture(html`<opc-loader></opc-loader>`);
    expect(el).to.be.accessible();
  });

  test("should show up", async () => {
    const opcLoader = (await fixture(
      html`<opc-provider></opc-provider>`
    )) as OpcLoader;
    opcLoader.hidden = true;
    await opcLoader.updateComplete;
    expect(opcLoader.hidden).to.be.true;
  });
});
