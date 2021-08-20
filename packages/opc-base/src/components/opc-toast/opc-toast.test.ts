import { axe, toHaveNoViolations } from "jest-axe";
import { OpcToast } from "./opc-toast";

expect.extend(toHaveNoViolations);

describe("opc-toast", () => {
  const OPC_COMPONENT = "opc-toast";
  const ELEMENT_ID = "opc-toast";
  let opcToast: OpcToast;

  const getShadowRoot = (tagName: string): ShadowRoot => {
    return document.body.getElementsByTagName(tagName)[0]
      .shadowRoot as ShadowRoot;
  };

  beforeEach(() => {
    opcToast = window.document.createElement(OPC_COMPONENT) as OpcToast;
    document.body.appendChild(opcToast);
  });

  afterEach(() => {
    document.body.getElementsByTagName(OPC_COMPONENT)[0].remove();
  });

  it("is defined", async () => {
    expect(opcToast).toBeDefined();
  });

  it("has no axe violations", async () => {
    expect(await axe(opcToast)).toHaveNoViolations();
  });

  it("should change properties", async () => {
    opcToast.options = { variant: "info" };
    opcToast.notification = { sentOn: "25/12/21" };
    await opcToast.updateComplete;
    expect(opcToast.options.variant).toEqual("info");
  });
});
