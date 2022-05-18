export const config = {
  baseURL: import.meta.env.BASE_URL,
  apiURL: import.meta.env.VITE_API_URL,
  sentryDSN: import.meta.env.VITE_SENTRY_DSN,
  nodeEnv: import.meta.env.MODE,
  opcBase: {
    apiBasePath: import.meta.env.VITE_OPC_BASE_API_URL,
    subscriptionsPath: import.meta.env.VITE_OPC_BASE_SUBSCRIPTION_URL,
    keycloakUrl: import.meta.env.VITE_OPC_BASE_KEYCLOAK_IDP_URL,
    keycloakClientId: import.meta.env.VITE_OPC_BASE_KEYCLOAK_CLIENT_ID,
    keycloakRealm: import.meta.env.VITE_OPC_BASE_KEYCLOAK_REALM,
  },
};
