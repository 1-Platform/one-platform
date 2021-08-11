import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  split,
  NormalizedCacheObject,
  FetchPolicy,
} from "@apollo/client/core";
import { setContext } from "@apollo/client/link/context";
import { getMainDefinition } from "@apollo/client/utilities";
import { WebSocketLink } from "@apollo/client/link/ws";

import { GraphqlConfig } from "./types";

/**
 * Helper Class for making API Calls to the One Platform API Gateway
 */
export class APIService {
  _apiBasePath: string;
  _subscriptionsPath: string;
  _wsLink: WebSocketLink;
  // ref to apollo-cache: https://www.apollographql.com/docs/react/api/core/ApolloClient/#apolloclient-functions
  _fetchPolicy: FetchPolicy = "cache-first";

  apollo: ApolloClient<NormalizedCacheObject>;
  constructor(config: GraphqlConfig) {
    this._apiBasePath = config.apiBasePath;
    this._subscriptionsPath = config.subscriptionsPath;
    this._fetchPolicy = config.cachePolicy || "cache-first";
    this._wsLink = new WebSocketLink({
      uri: this._subscriptionsPath,
      options: {
        reconnect: true,
        connectionParams: () => ({ ...this._headers }),
      },
    });
    this.apollo = this.apolloInit();
  }

  private apolloInit() {
    const httpLink = createHttpLink({
      uri: this._apiBasePath,
    });
    const authLink = setContext((_, { headers }) => {
      return {
        headers: {
          ...headers,
          ...this._headers,
        },
      };
    });

    const link = split(
      ({ query }) => {
        const definition = getMainDefinition(query);
        return (
          definition.kind === "OperationDefinition" &&
          definition.operation === "subscription"
        );
      },
      this._wsLink,
      authLink.concat(httpLink)
    );
    return new ApolloClient({
      link,
      cache: new InMemoryCache(),
      defaultOptions: {
        query: {
          fetchPolicy: this._fetchPolicy,
        },
      },
    });
  }

  /**
   * Returns the request headers with Authorization if jwtToken is present
   */
  get _headers() {
    return {
      "Content-Type": "application/json",
      Authorization: window.OpAuthHelper?.jwtToken
        ? "Bearer " + window.OpAuthHelper.jwtToken
        : "",
    };
  }

  query(query: string, variables: any) {
    return fetch(this._apiBasePath, {
      method: "POST",
      headers: this._headers,
      body: JSON.stringify({
        query,
        variables,
      }),
    })
      .then((res) => {
        if (!res) {
          throw new Error("The Server returned an empty response.");
        }
        return res.json();
      })
      .then((res) => {
        if (res.errors) {
          console.error("Error executing query: ", res.errors);
        }
        if (!res.data) {
          throw new Error(
            "There were some errors in the query" + JSON.stringify(res.errors)
          );
        }
        return res.data;
      });
  }
}
