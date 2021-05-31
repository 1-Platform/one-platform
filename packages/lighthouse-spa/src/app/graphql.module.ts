import { NgModule } from '@angular/core';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { ApolloClientOptions, InMemoryCache } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
import { environment } from '../environments/environment';
import { WebSocketLink } from '@apollo/client/link/ws';
import { split } from 'apollo-link';
import { getMainDefinition } from '@apollo/client/utilities';
import { RetryLink } from 'apollo-link-retry';
import { HttpHeaders } from '@angular/common/http';
import { onError } from 'apollo-link-error';


export function createApollo( httpLink: HttpLink ): ApolloClientOptions<any> {
  const wsClient = new WebSocketLink( {
    uri: environment.WS_URL,
    options: {
      reconnect: true,
      inactivityTimeout: 0,
      reconnectionAttempts: 10
    },
  } ) as any;

  const httpClient = httpLink.create( {
    uri: environment.API_URL,
    headers: new HttpHeaders().append( 'Authorization', `Bearer ${ window.OpAuthHelper.jwtToken }` )
  } ) as any;

  const splitLink = split(
    ( { query } ) => {
      const definition = getMainDefinition( query );
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsClient,
    httpClient,
  );
  const retry = new RetryLink( {
    delay: {
      initial: 500,
      max: Infinity,
      jitter: false
    },
    attempts: {
      max: 5,
      retryIf: ( _error, _operation ) => !!_error
    }
  } ) as any;

  const error = onError( ( { graphQLErrors, networkError } ) => {
    if ( graphQLErrors ) {
      graphQLErrors.map( ( { message, locations, path } ) =>
        console.log(
          `[GraphQL error]: Message: ${ JSON.stringify( message ) }, Location: ${ JSON.stringify( locations ) }, Path: ${ JSON.stringify( path ) }`,
        ),
      );
    }
    if ( networkError && networkError[ 'status' ] === 0 ) {
        this.isCertificateError.next( true );
        console.log( `[Network error]: ${ JSON.stringify( networkError ) }` );
      }
  } );


  const link = WebSocketLink.from( [
    retry,
    error,
    splitLink,
  ] );

  return {
    name: 'Lighthouse GraphQL Client',
    version: '0.0.1',
    link,
    cache: new InMemoryCache( {
      addTypename: false
    }),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all'
      }
    }
  };
}

@NgModule( {
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [ HttpLink ],
    },
  ],
} )
export class GraphQLModule { }
