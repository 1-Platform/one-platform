import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/react';

import opcBase from '@one-platform/opc-base';
import pkg from '../package.json';

import '@one-platform/opc-nav/dist/opc-nav';
import '@one-platform/opc-menu-drawer/dist/opc-menu-drawer';
import '@one-platform/opc-notification-drawer/dist/opc-notification-drawer';
import '@one-platform/opc-feedback/dist/opc-feedback';
import '@one-platform/opc-header/dist/opc-header';

import App from './App';

if (import.meta.env.MODE === 'production') {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    release: `opc-feedbacks-spa-@${pkg.version}`,
    environment: 'production',
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
}

if (opcBase?.auth) {
  opcBase.auth?.onLogin(() => {
    ReactDOM.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>,
      document.getElementById('root')
    );
  });
} else {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  );
}
