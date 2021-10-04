// Styles
import './App.scss';
// Components
import opcFooter from '@one-platform/opc-footer/dist/opc-footer';
import { footer } from './assets/footer';
import opcBase from '@one-platform/opc-base';
import '@one-platform/opc-base/dist/opc-provider';
import '@one-platform/opc-nav/dist/opc-nav';
import '@one-platform/opc-menu-drawer/dist/opc-menu-drawer';
import '@one-platform/opc-notification-drawer/dist/opc-notification-drawer';
import '@one-platform/opc-feedback/dist/opc-feedback';
import { Breadcrumb, BreadcrumbItem } from '@patternfly/react-core';
// Pages
import Main from './pages/Main';

opcBase.configure({
  apiBasePath: process.env.REACT_APP_API_URL,
  subscriptionsPath: process.env.REACT_APP_OP_SUBSCRIPTIONS_URL,
  keycloakUrl: process.env.REACT_APP_KEYCLOAK_IDP_URL,
  keycloakClientId: process.env.REACT_APP_KEYCLOAK_CLIENT_ID,
  keycloakRealm: process.env.REACT_APP_KEYCLOAK_REALM,
}); 

opcFooter.opcLinkCatagories = footer;

function App() {
  return (
    <div className="App">
      {/* <opc-provider>
        <opc-nav></opc-nav>
        <opc-menu-drawer></opc-menu-drawer>
        <opc-notification-drawer></opc-notification-drawer>
        <opc-feedback></opc-feedback>
      </opc-provider> */}
      <div className="breadcrumbs">
        <Breadcrumb>
          <BreadcrumbItem to="/">Home</BreadcrumbItem>
          <BreadcrumbItem to="/components-catalogue" isActive>Component Catalogue</BreadcrumbItem>
        </Breadcrumb>
      </div>
      <h3>Components Catalog</h3>
      <p>
        A Unified interface to access components from Chapeaux, Patternfly elements and One Platform components, 
        which allows in increase of collaboration and helps to improve component quality and development & delivery speed.
      </p>
      <main>
        <Main />
      </main>
      <footer>
        <opc-footer theme="dark"></opc-footer>
      </footer>
    </div>
  );
}

export default App;
