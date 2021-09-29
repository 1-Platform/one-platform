import Keycloak from "keycloak-js";

import { Token, UserInfoFn, LocalStorageCreds } from "./types";

/**
 * Helper class for Red Hat's Internal SSO Authentication
 */
export class OpKeycloakAuthProvider {
  _keycloak: Keycloak.KeycloakInstance;
  keycloakInitOptions: Keycloak.KeycloakInitOptions;
  _postLoginCallbacks: UserInfoFn[];

  constructor(keycloakOptions: Keycloak.KeycloakConfig) {
    this.keycloakInitOptions = {
      onLoad: "login-required",
      checkLoginIframe: false,
    };

    this._keycloak = Keycloak(keycloakOptions);
    this._keycloak.onTokenExpired = () => {
      this._keycloak
        .updateToken(30)
        .then((refreshed) => {
          if (refreshed) {
            this.saveTokens();
          }
        })
        .catch(console.error);
    };

    this._postLoginCallbacks = [];
  }

  /**
   * Initializes keycloak and redirects to the SSO for Sign In
   */
  async init() {
    try {
      const token = localStorage.getItem(LocalStorageCreds.LoginToken) || "";
      const refreshToken =
        localStorage.getItem(LocalStorageCreds.RefreshToken) || "";

      const authenticated = await this._keycloak.init({
        ...this.keycloakInitOptions,
        token,
        refreshToken,
      });

      this.saveTokens();

      if (!authenticated) {
        await this._keycloak.login();
      }

      this._postLoginCallbacks.map((fn) => {
        fn(this.getUserInfo());
      });
      this._removeHashes();
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Calls the callback function after a successful login
   *
   * @param {(user) => void} callback
   */
  onLogin(callback: UserInfoFn): void {
    /* If the user is already authenticated, then call the callback immediately */
    if (this.isAuthenticated) {
      callback(this.getUserInfo());
    } else {
      this._postLoginCallbacks.push(callback);
    }
  }

  /**
   * Logs the user out, and removes all user and token data from the localStorage and cookies
   */
  logout(): void {
    this._keycloak.logout();
  }

  /**
   * Checks if the user is already Authenticated
   */
  get isAuthenticated() {
    return this._keycloak.authenticated;
  }

  saveTokens(): void {
    localStorage.setItem(
      LocalStorageCreds.LoginToken,
      this._keycloak.token || ""
    );
    localStorage.setItem(
      LocalStorageCreds.RefreshToken,
      this._keycloak.refreshToken || ""
    );
  }

  /**
   * Returns the details of the logged in user
   */
  getUserInfo() {
    const token = this._keycloak.tokenParsed as Token;
    if (!token) {
      return null;
    }
    return {
      fullName: token.cn,
      email: token.email,
      employeeType: token.employeeType,
      firstName: token.firstName,
      lastName: token.lastName,
      title: token.title,
      rhatUUID: token.rhatUUID,
      kerberosID: token.uid,
      memberOf: token.memberOf,
      rhatLocation: token.rhatLocation,
      preferredTimeZone: token.preferredTimeZone,
      preferred_username: token.preferred_username,
      rhatNickname: token.rhatNickName,
      rhatGeo: token.rhatGeo,
      rhatCostCenter: token.rhatCostCenter,
      rhatCostCenterDesc: token.rhatCostCenterDesc,
      mobile: token.mobile,
      country: token.c,
      role: token.role,
    };
  }

  /**
   * Returns the JWT token in encoded form.
   *
   * Can be used as a Bearer token in any fetch queries for auth.
   */
  get jwtToken() {
    return this._keycloak.token;
  }

  /**
   * Removes any garbage hashes from the page URL
   */
  _removeHashes(): void {
    window.location.hash = window.location.hash.replace(
      "#not-before-policy=0",
      ""
    );
  }
}
