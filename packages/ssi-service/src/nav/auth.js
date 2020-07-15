import Jwt, { SsoEnv } from 'jwt-redhat';

/**
 * Helper class for Red Hat's Internal SSO Authentication
 */
class OpAuth {
  constructor () {
    this._jwt = Jwt;

    this._jwtOptions = {
      keycloakOptions: {
        realm: 'EmployeeIDP',
        clientId: 'one-portal',
        internalAuth: true,
      },
      keycloakInitOptions: {
        responseMode: 'fragment',
        flow: 'implicit',
      },
      ssoEnv: process.env.NODE_ENV === 'production' ? SsoEnv.PROD : SsoEnv.STAGE,
    };
    this._postLoginCallbacks = [];
  }

  /**
   * Initializes keycloak and redirects to the SSO for Sign In
   */
  init () {
    this._jwt.init( this._jwtOptions );
    this._jwt.onInit( ( res ) => {
      window.oninitJwt = res;
      if ( !this._jwt.isAuthenticated() ) {
        this._jwt.login();
      }

      this._postLoginCallbacks.map( fn => {
        fn( this.getUserInfo() );
      } );
      this._removeHashes();
    } );
    this._jwt.onInitError( ( err ) => {
      console.error( err );
    } );
  }

  /**
   * Calls the callback function after a successful login
   *
   * @param {(user) => void} callback
   */
  onLogin ( callback ) {
    this._postLoginCallbacks.push( callback );
  }

  /**
   * Logs the user out, and removes all user and token data from the localStorage and cookies
   */
  logout () {
    this._jwt.logout();
  }

  /**
   * Checks if the user is already Authenticated
   */
  get isAuthenticated () {
    return this._jwt.isAuthenticated();
  }

  /**
   * Returns the details of the logged in user
   */
  getUserInfo () {
    const token = this._jwt.getToken();
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
      region: token.region,
      location: token.location,
      preferredTimeZone: token.preferredTimeZone,
      rhatNickname: token.rhatNickname,
      rhatGeo: token.rhatGeo,
      rhatCostCenter: token.rhatCostCenter,
      rhatCostCenterDesc: token.rhatCostCenterDesc,
      mobile: token.mobile,
    };
  }

  /**
   * Returns the JWT token in encoded form.
   *
   * Can be used as a Bearer token in any fetch queries for auth.
   */
  get jwtToken () {
    return this._jwt.getEncodedToken();
  }

  /**
   * Removes any garbage hashes from the page URL
   */
  _removeHashes () {
    if ( window.location.hash.startsWith( '#token_type' ) ) {
      history.pushState( "", document.title, window.location.pathname + window.location.search );
    }
  }
}

export const OpAuthHelper = new OpAuth();
window.OpAuthHelper = OpAuthHelper;
