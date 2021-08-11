const opcBase = require("../dist/cjs/opc-base");

opcBase.configure({
  apiBasePath: "",
  subscriptionsPath: "",
  keycloakUrl: "",
  keycloakRealm: "",
  keycloakClientId: "",
});

require("../dist/cjs/opc-provider");
