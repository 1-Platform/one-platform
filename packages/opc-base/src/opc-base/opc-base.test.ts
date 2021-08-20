import opcBase from "./opc-base";

describe("opcBase", () => {
  it("should throw error", () => {
    expect(() => opcBase.config).toThrow();
  });

  it("should set the config", () => {
    const config = {
      apiBasePath: "",
      subscriptionsPath: "",
      keycloakUrl: "",
      keycloakRealm: "",
      keycloakClientId: "",
    };
    opcBase.configure(config);
    expect(opcBase.config).toMatchObject(config);
  });
});
