import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache, ApolloLink } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { environment } from 'src/environments/environment';

const uri = environment.graphqlAPI;

export function provideApollo(httpLink: HttpLink) {
  const basic = setContext((operation, context) => ({
    headers: {
      Accept: 'charset=utf-8'
    }
  }));
  const auth = setContext((operation, context) => ({
    headers: {
      Authorization: window.OpAuthHelper?.jwtToken
      ? 'Bearer ' + window.OpAuthHelper.jwtToken
      : '',
    },
  }));
  const link = ApolloLink.from( [ basic, auth, httpLink.create( { uri } ) ] );
  const cache = new InMemoryCache();
  return {
    link,
    cache
  };
}
@NgModule({
  exports: [
    HttpClientModule,
  ],
  providers: [{
    provide: APOLLO_OPTIONS,
    useFactory: provideApollo,
    deps: [HttpLink]
  }]
})
export class GraphQLModule {}
