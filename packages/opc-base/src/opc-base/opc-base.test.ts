// due to keyclock esbuild issue opc-base uses dist
import opcBase from "../../dist/opc-base";
import { expect } from "@open-wc/testing";

suite("opcBase", () => {
  test("should throw error", () => {
    expect(() => opcBase.config).to.throw();
  });

  test("should set the config", () => {
    const config = {
      apiBasePath: "",
      subscriptionsPath: "",
      keycloakUrl: "",
      keycloakRealm: "",
      keycloakClientId: "",
      projectId: "",
    };
    opcBase.configure(config);
    expect(opcBase.config).to.deep.eq(config);
  });
});
