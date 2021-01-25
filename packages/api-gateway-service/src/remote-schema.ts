import { fetch } from 'cross-fetch';
import { print } from 'graphql';
import { introspectSchema, wrapSchema } from '@graphql-tools/wrap';
import { observableToAsyncIterable, Subscriber } from 'graphql-tools';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import ws from 'ws';

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

function getSubscriber ( url: string, serviceName: string ): Subscriber {
  return async ( { document, variables, context }: any ) => {
    const client = new SubscriptionClient(
      url,
      {
        connectionParams: {
          'X-OP-User-ID': context?.uid,
          'From': 'OP-API-GATEWAY',
        },
        connectionCallback: ( err, res ) => {
          console.log( err, res );
        }
      },
      ws
    );

    return observableToAsyncIterable( {
      subscribe: observer => {
        console.log( new Date().toISOString(), '- Subscription forwarded to:', serviceName, url );
        return client.request( {
          query: document,
          variables,
        } )
          .subscribe( {
            next: ( data: any ) => {
              console.log( 'sending...' );
              return observer.next && observer.next( data );
            },
            error: ( err: any ) => {
              if ( !observer.error ) {
                return;
              }
              if ( err instanceof Error ) {
                observer.error( err );
              } else if ( err?.type === 'close' ) {
                observer.error( new Error( `Socket closed with event ${ err.code }` ) );
              } else {
                // GraphQLError[]
                observer.error( new Error( err.map( ( { message }: any ) => message ).join( ', ' ) ) );
              }
            },
            complete: () => observer.complete && observer.complete(),
          } );
      },
    } );
  };
}

export default async ({ uri, subscriptionsUri, name }: any) => {
  const executor = getExecutor( uri, name );
  const subscriber = getSubscriber( subscriptionsUri, name );
  return wrapSchema( {
    schema: await introspectSchema( executor ),
    executor,
    subscriber,
  } );
};
