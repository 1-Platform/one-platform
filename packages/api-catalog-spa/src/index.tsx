import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from '@sentry/react';
import reportWebVitals from './reportWebVitals';
import pkg from '../package.json';
import '@patternfly/react-core/dist/styles/base.css';

import '@one-platform/opc-nav/dist/opc-nav';
import '@one-platform/opc-menu-drawer/dist/opc-menu-drawer';
import '@one-platform/opc-notification-drawer/dist/opc-notification-drawer';
import '@one-platform/opc-feedback/dist/opc-feedback';

import App from './App';

import 'swagger-ui-react/swagger-ui.css';
import 'graphql-voyager/dist/voyager.css';

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    release: `api-catalog-spa@${pkg.version}`,
    environment: 'production',
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
}

const renderApp = () => {
  ReactDOM.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
    document.getElementById('root')
  );
};

// eslint-disable-next-line no-unused-expressions
window.OpAuthHelper ? window.OpAuthHelper.onLogin(renderApp) : renderApp();
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// eslint-disable-next-line no-console
reportWebVitals(console.debug);
