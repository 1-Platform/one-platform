/// <reference types="react-scripts" />

declare namespace NodeJS {
  interface ProcessEnv {
    REACT_APP_API_GATEWAY: string;
  }
}

declare interface Window {
  OpAuthHelper?: any;
  OpNotification?: any;
}

declare namespace JSX {
  interface IntrinsicElements {
    'opc-menu-drawer': any;
    'opc-notification-drawer': any;
    'opc-feedback': any;
    'opc-provider': any;
    'opc-nav': any;
  }
}
