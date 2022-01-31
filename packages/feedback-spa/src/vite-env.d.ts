/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPC_BASE_API_URL: string;
  readonly VITE_OPC_BASE_SUBSCRIPTION_URL: string;
  readonly VITE_OPC_BASE_KEYCLOAK_IDP_URL: string;
  readonly VITE_OPC_BASE_KEYCLOAK_CLIENT_ID: string;
  readonly VITE_OPC_BASE_KEYCLOAK_REALM: string;
  readonly VITE_API_URL: string;
  readonly VITE_SENTRY_DSN: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare namespace JSX {
  interface IntrinsicElements {
    'opc-header': any;
    'opc-footer': any;
    'opc-menu-drawer': any;
    'opc-notification-drawer': any;
    'opc-feedback': any;
    'opc-provider': any;
    'opc-nav': any;
    'opc-header-breadcrumb': any;
    'opc-header-links': any;
  }
}
