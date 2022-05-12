import { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { createClient, Provider } from 'urql';

import opcBase from '@one-platform/opc-base';
import '@one-platform/opc-base/dist/opc-provider';
import { RecentVisitProvider } from 'context/RecentVisitContext';
import { BreadcrumbProvider } from 'context/BreadcrumbContext';
import { config } from 'config';
import { Router } from 'router';

import { Loader } from './components';
import './app.scss';
import 'swagger-ui-react/swagger-ui.css';

opcBase.configure({
  apiBasePath: config.opcBase.apiBasePath,
  subscriptionsPath: config.opcBase.subscriptionsPath,
  keycloakUrl: config.opcBase.keycloakUrl,
  keycloakClientId: config.opcBase.keycloakClientId,
  keycloakRealm: config.opcBase.keycloakRealm,
});

const client = createClient({
  url: config.apiURL,
  requestPolicy: 'cache-and-network',
  maskTypename: true,
  fetchOptions: () => {
    const token = opcBase.auth?.jwtToken;
    return {
      headers: {
        authorization: token ? `Bearer ${token}` : '',
      },
    };
  },
});

const App = () => {
  return (
    <Provider value={client}>
      <RecentVisitProvider>
        <BrowserRouter basename={config.baseURL}>
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
