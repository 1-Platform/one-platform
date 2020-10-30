import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache, ApolloLink } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { environment } from 'src/environments/environment';

const uri = environment.API_URL;

const cleanTypeName = new ApolloLink( ( operation, forward ) => {
  if ( operation.variables ) {
    operation.variables = JSON.parse( JSON.stringify( operation.variables ), ( key, value ) =>
      ( key === '__typename' ? undefined : value ) );
  }
  return forward( operation ).map( ( data ) => {
    return data;
  } );
} );
const auth = setContext( ( operation, context ) => ( {
  headers: {
    Accept: 'charset=utf-8',
    Authorization: ( window as any ).OpAuthHelper?.jwtToken
      ? 'Bearer ' + ( window as any ).OpAuthHelper.jwtToken
      : '',
  },
} ) );


export function createApollo( httpLink: HttpLink ): any {
  const link = ApolloLink.from( [ cleanTypeName, auth, httpLink.create( { uri } ) ] );
  return {
    link,
    cache: new InMemoryCache(),
    name: 'Search WebApp Client',
    version: '1.0',
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'network-only',
      }
    }
  };
}

@NgModule({
  exports: [ HttpClientModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
