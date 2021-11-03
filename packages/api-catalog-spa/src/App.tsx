import { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { createClient, Provider } from 'urql';
import { RecentVisitProvider } from 'context/RecentVisitContext';
import { BreadcrumbProvider } from 'context/BreadcrumbContext';

import { Loader } from 'components/Loader';
import opcBase from '@one-platform/opc-base';
import '@one-platform/opc-base/dist/opc-provider';

import { Router } from './router';
import './App.scss';

opcBase.configure({
  apiBasePath: process.env.REACT_APP_OPCBASE_API_BASE_PATH as string,
  subscriptionsPath: process.env.REACT_APP_OPCBASE_SUBSCRIPTION_BASE_PATH as string,
  keycloakUrl: process.env.REACT_APP_OPCBASE_KEYCLOAK_URL as string,
  keycloakClientId: process.env.REACT_APP_OPCBASE_KEYCLOAK_CLIENT_ID as string,
  keycloakRealm: process.env.REACT_APP_OPCBASE_KEYCLOAK_REALM as string,
});

const client = createClient({
  url: process.env.REACT_APP_API_BASE_PATH as string,
  fetchOptions: () => {
    const token = window.OpAuthHelper.jwtToken;
    return {
      headers: { authorization: token ? `Bearer ${token}` : '' },
    };
  },
  maskTypename: true,
  requestPolicy: 'cache-and-network',
});

const App = (): JSX.Element => {
  return (
    <Provider value={client}>
      <RecentVisitProvider>
        <BrowserRouter>
          <BreadcrumbProvider>
            <Suspense fallback={<Loader />}>
              <opc-provider>
                <opc-nav />
                <opc-menu-drawer />
                <opc-notification-drawer />
                <opc-feedback />
              </opc-provider>
              <Router />
            </Suspense>
          </BreadcrumbProvider>
        </BrowserRouter>
      </RecentVisitProvider>
    </Provider>
  );
};

export default App;
