// lit ref.ts directive causes some es module error with esbuild thus using the build file
// in future this may get removed and directly uses the file like other lit components
import { OpcProvider } from "../../dist/opc-provider";
import { getNotificationAppCount } from "./opc-provider.helper";
import { fixture, assert, expect } from "@open-wc/testing";
import { html } from "lit/static-html.js";

const COMPONENT_NAME = "opc-provider";

suite(COMPONENT_NAME, () => {
  test("is defined", () => {
    const el = document.createElement(COMPONENT_NAME);
    assert.instanceOf(el, OpcProvider);
  });

  test("should render properly", async () => {
    const el = await fixture(html`<opc-provider></opc-provider>`);
    assert.shadowDom.equal(
      el,
      `
      <opc-loader></opc-loader>
      <slot></slot>
      <div class="opc-toast-container"></div>
     `
    );
  });

  test("has no axe violations", async () => {
    const el = await fixture(html`<opc-provider></opc-provider>`);
    expect(el).to.be.accessible();
  });

  test("should change warning property", async () => {
    const opcProvider = (await fixture(
      html`<opc-provider></opc-provider>`
    )) as OpcProvider;
    opcProvider.isWarningHidden = true;
    await opcProvider.updateComplete;
    expect(opcProvider.isWarningHidden).to.be.true;
  });
});

suite("opc-provider helper functions", () => {
  test("getNotificationAppCount: should get count with others in list", () => {
    const notifications = [{ id: "5ef", app: "search" }, { id: "erf" }];
    const appNotificationCount = getNotificationAppCount(notifications);
    expect(appNotificationCount).to.deep.eq({ search: 1, others: 1 });
  });

  test("getNotificationAppCount: should get count with known apps in list", () => {
    const notifications = new Array(5).fill({ id: "5ef", app: "search" });
    const appNotificationCount = getNotificationAppCount(notifications);
    expect(appNotificationCount["search"]).eq(5);
  });
});
