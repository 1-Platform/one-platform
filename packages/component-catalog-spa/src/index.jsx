import React from 'react';
import ReactDOM from 'react-dom';
import * as Sentry from "@sentry/react";
import './index.scss';
import App from './App';
import reportWebVitals from './reportWebVitals';
import pkg from '../package.json';
import { BrowserRouter } from 'react-router-dom';
import '@patternfly/pfe-markdown/dist/pfe-markdown';
import '@patternfly/pfe-cta/dist/pfe-cta';

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    release: `component-catalog-spa@${pkg.version}`,
    environment: 'production',
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
}

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
