import React from "react";
import { render } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import * as Sentry from "@sentry/react";

import "@patternfly/react-core/dist/styles/base.css";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

import pkg from "../package.json";

import BreadcrumbContextProvider from "./context/BreadcrumbContext.jsx";

if (process.env.NODE_ENV === "production") {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    release: `op-user-group-spa@${pkg.version}`,
    environment: "production",
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0,
  });
}

const renderApp = () => {
  render(
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <BreadcrumbContextProvider>
        <App />
      </BreadcrumbContextProvider>
    </BrowserRouter>,
    document.getElementById("root")
  );
};

window.OpAuthHelper ? window.OpAuthHelper.onLogin(renderApp) : renderApp();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
