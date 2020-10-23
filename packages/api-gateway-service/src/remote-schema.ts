import { fetch } from 'cross-fetch';
import { print } from 'graphql';
import { introspectSchema, wrapSchema } from '@graphql-tools/wrap';
import { createClient } from 'graphql-transport-ws';
import { observableToAsyncIterable } from '@graphql-tools/utils';

function getExecutor ( uri: string, serviceName: string ) {
  return async ( { document, variables, context }: any ) => {
    console.log( new Date().toISOString(), '- forward via http to:', serviceName );
    const query = print( document );
    const fetchResult = await fetch( uri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-OP-User-ID': context?.uid,
        'From': 'OP-API-GATEWAY'
      },
      body: JSON.stringify( { query, variables } ),
    } );

    return fetchResult.json();
  };
}

function getSubscriber( url: string, serviceName: string): any {
  return ( { document, variables, context }: any ) => {
    const subscriptionClient = createClient( {
      url,
      connectionParams: {
        'X-OP-User-ID': context?.uid,
        'From': 'OP-API-GATEWAY'
      }
    } );

    return observableToAsyncIterable( {
      subscribe: observer => {
        console.log( new Date().toISOString(), '- Subscription forwarded to:', serviceName );
        return {
          unsubscribe: subscriptionClient.subscribe(
            {
              query: document,
              variables,
            },
            {
              next: data => observer.next && observer.next( data ),
              error: err => {
                if ( !observer.error ) {
                  return;
                }
                if ( err instanceof Error ) {
                  observer.error( err );
                } else if ( err instanceof CloseEvent ) {
                  observer.error( new Error( `Socket closed with event ${ err.code }` ) );
                } else {
                  // GraphQLError[]
                  observer.error( new Error( err.map( ( { message } ) => message ).join( ', ' ) ) );
                }
              },
              complete: () => observer.complete && observer.complete(),
            }
          ),
        };
      },
    } );
  };
}

export default async ({ uri, subcriptionUri, name }: any) => {
  const executor = getExecutor( uri, name );
  const subscriber = getSubscriber( subcriptionUri, name );
  return wrapSchema( {
    schema: await introspectSchema( executor ),
    executor,
    subscriber,
  } );
};
