import { ApolloClient } from 'apollo-client';
import { WebSocketLink } from 'apollo-link-ws';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { split } from 'apollo-link';

/**
 * Helper Class for making API Calls to the One Platform API Gateway
 */
export class APIService {
  constructor () {
    this._apiBasePath = process.env.APPS_BASE_API;
    this._apiBaseURL = new URL( this._apiBasePath );

    this._wsLink = new WebSocketLink( {
      uri: `wss://${ this._apiBaseURL.host }/subscriptions`,
      options: {
        reconnect: true,
        connectionParams: () => ({ ...this._headers })
        },
    } );
  }

  get apollo () {
    const link = split(
      () => true,
      this._wsLink,
      new HttpLink( {
        uri: this._apiBasePath,
        headers: this._headers
      } ),
    );
    return new ApolloClient( {
      link,
      cache: new InMemoryCache(),
    } );
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
          console.error( 'Error executing query: ', res.errors );
        }
        if ( !res.data ) {
          throw new Error( 'There were some errors in the query' + JSON.stringify( res.errors ) );
        }
        return res.data;
      } );
  }

  /**
   * Fetch the list of all the Apps for the App Drawer
   */
  navDrawerData (targets) {
    const query = `
      query NavMenu ($targets: [String]!) {
        appsList: getHomeTypeBy( input: {entityType: "spa"} ) {
          name
          link
          icon
          active
          applicationType
        }
        notificationsList: listArchivedNotifications(targets: $targets , limit: 25) {
          id
          subject
          body
          data
          link
          sentOn
        }
      }
    `;
    return this.query( query, { targets } );
  }
}

/**
 * GraphQL API helper
 */
const APIServiceInstance = new APIService();
export default APIServiceInstance;
