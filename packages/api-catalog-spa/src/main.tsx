import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/react/esm';
import { config } from 'config';

import pkg from '../package.json';

import '@one-platform/opc-nav/dist/opc-nav';
import '@one-platform/opc-menu-drawer/dist/opc-menu-drawer';
import '@one-platform/opc-notification-drawer/dist/opc-notification-drawer';
import '@one-platform/opc-feedback/dist/opc-feedback';

import App from './App';

if (config.nodeEnv === 'production') {
  Sentry.init({
    dsn: config.sentryDSN,
    release: `op-api-catalog-spa@${pkg.version}`,
    environment: 'production',
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
}

window.OpAuthHelper.onLogin(() => {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  );
});
