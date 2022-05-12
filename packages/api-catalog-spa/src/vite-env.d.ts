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

interface Window {
  OpAuthHelper: OpAuthHelper;
  OpNotification: OpNotification;
}

interface OpNotification {
  success: (arg0: NotificationArg) => void;
  warning: (arg0: NotificationArg) => void;
  danger: (arg0: NotificationArg) => void;
}

interface NotificationArg {
  subject: string;
  body?: string;
}

interface OpAuthHelper {
  getUserInfo: () => UserDetails;
  jwtToken: string;
  onLogin: (cb: () => void | Promise<void>) => void;
}

interface UserDetails {
  country: string;
  email: string;
  employeeType: string;
  firstName: string;
  fullName: string;
  kerberosID: string;
  lastName: string;
  memberOf: string;
  mobile: undefined;
  preferredTimeZone: string;
  rhatCostCenter: string;
  rhatCostCenterDesc: string;
  rhatGeo: string;
  rhatLocation: string;
  rhatNickname: undefined;
  rhatUUID: string;
  roles: string[];
  title: string;
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
