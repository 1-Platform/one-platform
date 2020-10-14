import Keycloak from 'keycloak-js';

/**
 * Helper class for Red Hat's Internal SSO Authentication
 */
class OpAuth {
  constructor () {
    this.keycloakOptions = {
      clientId: process.env.KEYCLOAK_CLIENT_ID,
      realm: process.env.KEYCLOAK_REALM,
      url: process.env.KEYCLOAK_IDP_URL,
    };
    this.keycloakInitOptions = {
      onLoad: 'login-required',
      checkLoginIframe: false,
      enableLogging: true,
    };

    this._keycloak = new Keycloak(this.keycloakOptions);
    this._keycloak.onTokenExpired = ( e ) => {
      this._keycloak.updateToken( 30 ).catch(console.error);
    };

    this._postLoginCallbacks = [];
  }

  /**
   * Initializes keycloak and redirects to the SSO for Sign In
   */
  async init () {
    try {
      const authenticated = await this._keycloak.init( this.keycloakInitOptions );
      if ( !authenticated ) {
        await this._keycloak.login();
      }
      this._postLoginCallbacks.map( fn => {
        fn( this.getUserInfo() );
      } );
      this._removeHashes();
    } catch ( err ) {
      console.error( err );
    };
  }

  /**
   * Calls the callback function after a successful login
   *
   * @param {(user) => void} callback
   */
  onLogin ( callback ) {
    this._postLoginCallbacks.push( callback );

    /* If the user is already authenticated, then call the callback immediately */
    if ( this.isAuthenticated ) {
      callback( this.getUserInfo() );
    }
  }

  /**
   * Logs the user out, and removes all user and token data from the localStorage and cookies
   */
  logout () {
    this._keycloak.logout();
  }

  /**
   * Checks if the user is already Authenticated
   */
  get isAuthenticated () {
    return this._keycloak.authenticated;
  }

  /**
   * Returns the details of the logged in user
   */
  getUserInfo () {
    const token = this._keycloak.tokenParsed;
    if ( !token ) {
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
      rhatNickname: token.rhatNickName,
      rhatGeo: token.rhatGeo,
      rhatCostCenter: token.rhatCostCenter,
      rhatCostCenterDesc: token.rhatCostCenterDesc,
      mobile: token.mobile,
      country: token.c,
      roles: this._keycloak.realmAccess?.roles || [],
    };
  }

  /**
   * Returns the JWT token in encoded form.
   *
   * Can be used as a Bearer token in any fetch queries for auth.
   */
  get jwtToken () {
    return this._keycloak.token;
  }

  /**
   * Removes any garbage hashes from the page URL
   */
  _removeHashes () {
    window.location.hash = window.location.hash.replace( '#not-before-policy=0', '' );
  }
}

export const OpAuthHelper = new OpAuth();
window.OpAuthHelper = OpAuthHelper;
