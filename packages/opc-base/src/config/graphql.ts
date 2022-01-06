import { Client, defaultExchanges, RequestPolicy, subscriptionExchange } from "@urql/core";
import { SubscriptionClient } from "subscriptions-transport-ws";


import { GraphqlConfig } from "./types";

/**
 * Helper Class for making API Calls to the One Platform API Gateway
 */
export class APIService {
  _apiBasePath: string;
  _subscriptionsPath: string;
  _wsLink: SubscriptionClient;
  // ref to urql-cache: https://formidable.com/open-source/urql/docs/graphcache/
  _fetchPolicy: RequestPolicy = "cache-first";

  gqlClient: Client;
  constructor(config: GraphqlConfig) {
    this._apiBasePath = config.apiBasePath;
    this._subscriptionsPath = config.subscriptionsPath;
    this._fetchPolicy = config.cachePolicy || "cache-first";

    this._wsLink = new SubscriptionClient(this._subscriptionsPath, {
      reconnect: true,
      connectionParams: () => ({ ...this._headers }),
      minTimeout: 5000,
    });
    this.gqlClient = this.gqlInit();
  }

  private gqlInit() {
    return new Client({
      url: this._apiBasePath,
      fetchOptions: () => ({ headers: this._headers }),
      exchanges: [
        ...defaultExchanges,
        subscriptionExchange({
          forwardSubscription: (operation) =>
            this._wsLink.request(operation) as any,
        }),
      ],
    });
  }

  /**
   * Returns the request headers with Authorization if jwtToken is present
   */
  get _headers() {
    return {
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
