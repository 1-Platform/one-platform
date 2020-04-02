import { NgModule } from '@angular/core';
import { HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Apollo, ApolloModule } from 'apollo-angular';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { environment } from '../environments/environment';
import { onError } from 'apollo-link-error';
import { ApolloLink, split } from 'apollo-link';
import { RetryLink } from 'apollo-link-retry';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';

@NgModule({
  exports: [
    HttpClientModule,
    ApolloModule,
    HttpLinkModule
  ]
})
export class GraphQLModule {
  authorization = environment.authorization;
  header = new HttpHeaders().append('Authorization', this.authorization);
  constructor(apollo: Apollo, httpLink: HttpLink) {

    const uri = environment.graphqlAPI;
    const httpClient = httpLink.create({ uri: uri, headers: this.header });

    const error = onError(({ graphQLErrors, networkError }) => {
      if (graphQLErrors) {
        graphQLErrors.map(({ message, locations, path }) =>
          console.log(
            `[GraphQL error]: Message: ${JSON.stringify(message)}, Location: ${JSON.stringify(locations)}, Path: ${JSON.stringify(path)}`,
          ),
        );
      }
      if (networkError) {
        if (networkError['status'] === 0) {
          console.log(`[Network error]: ${JSON.stringify(networkError)}`);
        }
      }
    });

    const retry = new RetryLink({
      delay: {
        initial: 500,
        max: Infinity,
        jitter: false
      },
      attempts: {
        max: 5,
        retryIf: (_error, _operation) => !!_error
      }
    });

    const omitTypename = (key, value) => (key === '__typename' ? undefined : value);
    const cleanTypeName = new ApolloLink((operation, forward) => {
      if (operation.variables) {
        operation.variables = JSON.parse(JSON.stringify(operation.variables), omitTypename);
      }
      return forward(operation).map((data) => {
        return data;
      });
    });


    const wsClient = new WebSocketLink({
      uri: environment.subscription,
      options: {
        reconnect: true,
        inactivityTimeout: 0,
        reconnectionAttempts: 10,
        connectionParams: {
          headers: {
            'Authorization': this.authorization
          }
        }
      },
    });
    const httpWslink = split(
      ({ query }) => {
        const { kind, operation }: any = getMainDefinition(query);
        return kind === 'OperationDefinition' && operation === 'subscription';
      },
      wsClient,
      httpClient,
    );

    const link = WebSocketLink.from([
      cleanTypeName,
      retry,
      error,
      httpWslink,
    ]);

    apollo.create({
      link: link,
      cache: new InMemoryCache(),
      defaultOptions: {
        watchQuery: {
          fetchPolicy: 'network-only',
          errorPolicy: 'all'
        }
      }
    });
  }  
}
