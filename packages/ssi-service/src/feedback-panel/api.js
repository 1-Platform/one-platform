/**
 * Helper class for making API calls to the One Platform API Gateway
 */
export class APIService {
  constructor () {
    this._apiBasePath = process.env.APPS_BASE_API;
  }

  /**
   * Returns the request headers with Authorization if jwtToken is present
   */
  get _headers () {
    const headers = {
      'Content-Type': 'application/json',
    }

    if ( this.authToken ) {
      headers.Authorization = 'Bearer ' + this.authToken;
    } else if ( window.OpAuthHelper?.jwtToken ) {
      headers.Authorization = 'Bearer ' + window.OpAuthHelper.jwtToken;
    }

    return headers;
  }

  /**
   * Use a custom endpoint or auth token for the Feedback Graphql APIs
   * @param {{ endpoint: string, authToken: string }} basePath
   */
  config ( { endpoint, authToken } ) {
    if ( endpoint ) {
      this._apiBasePath = endpoint;
    }
    if ( authToken ) {
      this.authToken = authToken;
    }
  }

  /**
   * Sends a graphql request
   */
  request ( query, variables = undefined ) {
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
          throw new Error( 'The Server returned an empty response' );
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
}

const APIServiceInstance = new APIService();
export default APIServiceInstance;
