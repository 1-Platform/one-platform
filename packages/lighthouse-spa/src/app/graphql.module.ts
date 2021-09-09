import { NgModule } from '@angular/core';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { ApolloClientOptions, InMemoryCache } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
import { environment } from '../environments/environment';
import { createHttpLink, split } from '@apollo/client/core';
import { WebSocketLink } from '@apollo/client/link/ws';
import { setContext } from '@apollo/client/link/context';
import { getMainDefinition } from '@apollo/client/utilities';
import { RetryLink } from 'apollo-link-retry';
import { onError } from 'apollo-link-error';

export function createApollo(): ApolloClientOptions<any> {
  const wsClient = new WebSocketLink({
    uri: environment.WS_URL,
    options: {
      reconnect: true,
      inactivityTimeout: 0,
      reconnectionAttempts: 10,
      connectionParams: {
        Authorization: `Bearer ${window.OpAuthHelper.jwtToken}`,
      },
    },
  });

  const httpLink = createHttpLink({
    uri: environment.API_URL,
  });

  const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = window.OpAuthHelper.jwtToken;
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        Authorization: token ? `Bearer ${token}` : '',
      },
    };
  });

  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsClient,
    authLink.concat(httpLink)
  );
  const retry = new RetryLink({
    delay: {
      initial: 500,
      max: Infinity,
      jitter: false,
    },
    attempts: {
      max: 5,
      retryIf: (_error, _operation) => !!_error,
    },
  }) as any;

  const error = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.map(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${JSON.stringify(
            message
          )}, Location: ${JSON.stringify(locations)}, Path: ${JSON.stringify(
            path
          )}`
        )
      );
    }
    if (networkError && networkError['status'] === 0) {
      this.isCertificateError.next(true);
      console.log(`[Network error]: ${JSON.stringify(networkError)}`);
    }
  });

  const link = WebSocketLink.from([retry, error, splitLink]);

  return {
    name: 'Lighthouse GraphQL Client',
    version: '0.0.1',
    link,
    cache: new InMemoryCache({
      addTypename: false,
    }),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
      },
    },
  };
}

@NgModule({
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
