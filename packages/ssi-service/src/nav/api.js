/**
 * Helper Class for making API Calls to the One Platform API Gateway
 */
export class APIService {
  constructor () {
    this._apiBasePath = process.env.APPS_BASE_API;
  }

  /**
   * Returns the request headers with Authorization if jwtToken is present
   */
  get _headers () {
    return {
      'Content-Type': 'application/json',
      Authorization: window.OpAuthHelper?.jwtToken
        ? 'Bearer ' + window.OpAuthHelper.jwtToken
        : '',
    };
  }

  /**
   * Sends graphql query requests
   * @param {string} query
   * @param {any} variables
   */
  query ( query, variables = undefined ) {
    return fetch( this._apiBasePath, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify( {
        query,
        variables,
      } ),
    } )
      .then( res => {
        if ( !res ) {
          throw new Error( 'The Server returned an empty response.' );
        }
        return res.json();
      } )
      .then( res => {
        if ( res.errors ) {
          throw new Error( 'There were some errors in the query' + JSON.stringify( res.errors ) );
        }
        return res.data;
      } );
  }

  /**
   * Fetch the list of all the Apps for the App Drawer
   */
  listApps () {
    const query = `
      query ListApps {
        getHomeTypeBy( input: {entityType: "spa"} ) {
          name
          link
          icon
        }
      }
    `;
    return this.query( query ).then( res => res.getHomeTypeBy );
  }
}

/**
 * GraphQL API helper
 */
const APIServiceInstance = new APIService();
export default APIServiceInstance;
