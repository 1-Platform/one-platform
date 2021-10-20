import opcBase from "@one-platform/opc-base";
import "@one-platform/opc-base/dist/opc-provider";
import "@one-platform/opc-feedback/dist/opc-feedback";
import "@one-platform/opc-footer/dist/opc-footer";
import "@one-platform/opc-header/dist/opc-header";
import "@one-platform/opc-menu-drawer/dist/opc-menu-drawer";
import "@one-platform/opc-nav/dist/opc-nav";
import "@one-platform/opc-notification-drawer/dist/opc-notification-drawer";
import "core-js/stable";
import "regenerator-runtime/runtime";
import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import { createProvider } from "./vue-apollo";
const jsonexport = require("jsonexport");

Vue.component("jsonexport", jsonexport);

opcBase.configure({
  apiBasePath: process.env.VUE_APP_OPCBASE_API_BASE_PATH,
  subscriptionsPath: process.env.VUE_APP_OPCBASE_SUBSCRIPTION_BASE_PATH,
  keycloakUrl: process.env.VUE_APP_OPCBASE_KEYCLOAK_URL,
  keycloakClientId: process.env.VUE_APP_OPCBASE_KEYCLOAK_CLIENT_ID,
  keycloakRealm: process.env.VUE_APP_OPCBASE_KEYCLOAK_REALM,
});
Vue.config.productionTip = false;
window.OpAuthHelper.onLogin(() => {
  new Vue({
    router,
    store,
    apolloProvider: createProvider(),
    render: (h) => h(App),
  }).$mount("#app");
});
