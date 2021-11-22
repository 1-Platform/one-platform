import { Client } from "@urql/core";
import { OpKeycloakAuthProvider } from "../keycloakAuthProvider/keycloakAuthProvider";
import { OpcBase as OpcBaseType, Config, Toast, Feedback } from "./types";

/**
 * opcBase is a singleton class in which is passed to every package of opc-base
 * It contains configuration, methods like toast, feedback etc
 * It's exported as freezed instance giving absolute control on its mutation
 * Setter and getter are used to control mutation on methods
 */
class OpcBase {
  private _app: OpcBaseType = {};

  configure(config: Config) {
    this._app.config = config;

    const auth = new OpKeycloakAuthProvider({
      realm: config.keycloakRealm,
      clientId: config.keycloakClientId,
      url: config.keycloakUrl,
    });
    auth.init();
    this._app.auth = auth;
    window.OpAuthHelper = auth;
  }

  get config() {
    if (!this._app.config) throw Error("Empty configuration.");
    return { ...this._app.config }; // to avoid direct mutation
  }

  get auth() {
    return this._app.auth;
  }

  set toast(toast: Toast) {
    if (!this._app.toast) {
      this._app.toast = toast;
    } else {
      this._app.config?.isDebugMode && console.warn("Cannot set toast");
    }
  }

  get toast() {
    if (!this._app.toast) throw Error("Toast is not set");
    return this._app.toast;
  }

  set feedback(feedback: Feedback) {
    if (!this._app.feedback) {
      this._app.feedback = feedback;
    } else {
      this._app.config?.isDebugMode && console.warn("Cannot set feedback");
    }
  }

  get feedback() {
    if (!this._app.feedback) throw Error("Feedback is not set");
    return this._app.feedback;
  }

  set api(api: Client) {
    if (!this._app.api) {
      this._app.api = api;
    } else {
      this._app.config?.isDebugMode && console.warn("Cannot set api client");
    }
  }

  get api() {
    if (!this._app.api) throw Error("Graphql instanace is not set");
    return this._app.api;
  }
}

const opcBase = new OpcBase();
Object.freeze(opcBase);
export default opcBase;
