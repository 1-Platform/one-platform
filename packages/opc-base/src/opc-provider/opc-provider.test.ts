import { axe, toHaveNoViolations } from "jest-axe";
import { OpcProvider } from "./opc-provider";
import { getNotificationAppCount } from "./opc-provider.helper";

expect.extend(toHaveNoViolations);

describe("opc-provider", () => {
  const OPC_COMPONENT = "opc-provider";
  const ELEMENT_ID = "opc-provider";
  let opcProvider: OpcProvider;

  const getShadowRoot = (tagName: string): ShadowRoot => {
    return document.body.getElementsByTagName(tagName)[0]
      .shadowRoot as ShadowRoot;
  };

  beforeEach(() => {
    opcProvider = window.document.createElement(OPC_COMPONENT) as OpcProvider;
    document.body.appendChild(opcProvider);
  });

  afterEach(() => {
    document.body.getElementsByTagName(OPC_COMPONENT)[0].remove();
  });

  it("is defined", async () => {
    expect(opcProvider).toBeDefined();
  });

  it("has no axe violations", async () => {
    expect(await axe(opcProvider)).toHaveNoViolations();
  });

  it("should change warning property", async () => {
    opcProvider.isWarningHidden = true;
    await opcProvider.updateComplete;
    expect(opcProvider.isWarningHidden).toBeTruthy();
  });
});

describe("opc-provider helper functions", () => {
  it("getNotificationAppCount: should get count with others in list", () => {
    const notifications = [{ id: "5ef", app: "search" }, { id: "erf" }];
    const appNotificationCount = getNotificationAppCount(notifications);
    expect(appNotificationCount).toMatchObject({ search: 1, others: 1 });
  });

  it("getNotificationAppCount: should get count with known apps in list", () => {
    const notifications = new Array(5).fill({ id: "5ef", app: "search" });
    const appNotificationCount = getNotificationAppCount(notifications);
    expect(appNotificationCount["search"]).toEqual(5);
  });
});
