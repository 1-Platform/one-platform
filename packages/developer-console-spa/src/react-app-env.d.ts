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
