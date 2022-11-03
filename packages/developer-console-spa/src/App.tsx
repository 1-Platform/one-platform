import { Switch, Route, Redirect } from 'react-router-dom';
import '@patternfly/patternfly/patternfly.css';
import '@patternfly/patternfly/patternfly-addons.css';
import './App.css';
import Home from 'pages/Home';
import ProjectConsoleShell from 'pages/ProjectConsoleShell';
import Overvew from 'pages/Overview';
import ConfigureSearch from 'pages/ConfigureSearch';
import Database from 'pages/Database';
import ConfigureFeedback from 'pages/Feedback/ConfigureFeedback';
import FeedbackList from 'pages/Feedback/FeedbackList';
import ConfigureLighthouse from 'pages/Lighthouse';
import NewProjectForm from 'common/components/NewProjectForm';
import NotFound from 'pages/NotFound';
import ConfigureOPNavbar from 'pages/OPNavbar';
import ProjectSettings from 'pages/ProjectSettings';
import UnderDevelopment from 'common/components/UnderDevelopment';
import opcBase from '@one-platform/opc-base';
import '@one-platform/opc-base/dist/opc-provider';

opcBase.configure({
  apiBasePath: process.env.REACT_APP_API_URL!,
  subscriptionsPath: process.env.REACT_APP_OP_SUBSCRIPTIONS_URL!,
  keycloakUrl: process.env.REACT_APP_KEYCLOAK_IDP_URL!,
  keycloakClientId: process.env.REACT_APP_KEYCLOAK_CLIENT_ID!,
  keycloakRealm: process.env.REACT_APP_KEYCLOAK_REALM!,
});

function App() {
  return (
    <>
      <opc-provider>
        <opc-nav></opc-nav>
        <opc-menu-drawer></opc-menu-drawer>
        <opc-notification-drawer></opc-notification-drawer>
        <opc-feedback theme="blue"></opc-feedback>
      </opc-provider>
      <Switch>
        <Route path="/" component={ Home } exact />
        <Route path="/:projectId">
          <ProjectConsoleShell>
            <Switch>
              <Redirect path="/:projectId" to="/:projectId/overview" exact />
              <Route path="/:projectId/overview" component={ Overvew } exact />
              <Route path="/:projectId/analytics" component={ UnderDevelopment } exact />
              <Route path="/:projectId/op-navbar" component={ ConfigureOPNavbar } exact />
              <Route path="/:projectId/hosting" component={ UnderDevelopment } exact />
              <Route path="/:projectId/hosting/:spaName" component={ UnderDevelopment } exact />
              <Route path="/:projectId/database" component={ Database } />
              <Route path="/:projectId/feedback" component={ FeedbackList } exact />
              <Route path="/:projectId/feedback/edit" component={ ConfigureFeedback } exact />
              <Route path="/:projectId/lighthouse" component={ ConfigureLighthouse } exact />
              <Route path="/:projectId/search" component={ ConfigureSearch } exact />
              <Route path="/:projectId/notifications" component={ UnderDevelopment } exact />
              <Route path="/:projectId/user-groups" component={ UnderDevelopment } exact />
              <Route path="/:projectId/settings" component={ ProjectSettings } />
              <Route path="*" component={ NotFound } />
            </Switch>
          </ProjectConsoleShell>
        </Route>
      </Switch>
      <NewProjectForm />
    </>
  );
}

export default App;
