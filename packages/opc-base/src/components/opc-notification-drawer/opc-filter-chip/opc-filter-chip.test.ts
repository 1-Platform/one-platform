import { OpcFilterChip } from "./opc-filter-chip";

import { fixture, assert, expect } from "@open-wc/testing";
import { html } from "lit/static-html.js";

const COMPONENT_TAG = "opc-filter-chip";

suite(COMPONENT_TAG, () => {
  test("is defined", () => {
    const el = document.createElement(COMPONENT_TAG);
    assert.instanceOf(el, OpcFilterChip);
  });

  test("should render properly", async () => {
    const el = await fixture(html`<opc-filter-chip></opc-filter-chip>`);
    assert.shadowDom.equal(
      el,
      `
      <button
        class="opc-notification-drawer__header-chip"
        name="filter-chip"
        aria-label="filter-chip"
      >
        <slot></slot>
      </button>
     `
    );
  });

  test("has no axe violations", async () => {
    const el = await fixture(html`<opc-filter-chip></opc-filter-chip>`);
    expect(el).to.be.accessible();
  });

  test("should be active", async () => {
    const opcFilterChip = (await fixture(
      html`<opc-filter-chip></opc-filter-chip>`
    )) as OpcFilterChip;
    opcFilterChip.isChipActive = true;
    await opcFilterChip.updateComplete;
    expect(opcFilterChip.isChipActive).to.be.true;
  });
});
