import { Switch, Route, Redirect } from 'react-router-dom';
import '@patternfly/patternfly/patternfly.css';
import '@patternfly/patternfly/patternfly-addons.css';
import './App.css';
import AppIndex from './components/AppIndex';
import AppConsoleShell from './components/AppConsoleShell';
import AppOverview from './components/AppOverview';
import NotFound from './components/NotFound';
import AddAppForm from './components/AddAppForm';
import UnderDevelopment from './components/UnderDevelopment';
import FeedbackList from "./components/feedback/FeedbackList";
import ConfigureFeedback from "./components/feedback/ConfigureFeedback";
import ConfigureLighthouse from './components/ConfigureLighthouse';
import ConfigureSSI from './components/ConfigureSSI';
import ConfigureDatabase from './components/ConfigureDatabase';
import ConfigureCouchDB from './components/ConfigureCouchDB';
import AppSettings from './components/AppSettings';

function App() {
  return (
    <>
      <Switch>
        <Route path="/" component={ AppIndex } exact />
        <Route path="/:appId">
          <AppConsoleShell>
            <Switch>
              <Redirect path="/:appId" to="/:appId/overview" exact />
              <Route path="/:appId/overview" component={ AppOverview } exact />
              <Route path="/:appId/analytics" component={ UnderDevelopment } exact />
              <Route path="/:appId/ssi" component={ ConfigureSSI } exact />
              <Route path="/:appId/database" component={ ConfigureDatabase } exact />
              <Route path="/:appId/feedback" component={ FeedbackList } exact />
              <Route path="/:appId/feedback/edit" component={ ConfigureFeedback } exact />
              <Route path="/:appId/lighthouse" component={ ConfigureLighthouse } exact />
              <Route path="/:appId/search" component={ UnderDevelopment } exact />
              <Route path="/:appId/couchdb" component={ ConfigureCouchDB } />
              <Route path="/:appId/notifications" component={ UnderDevelopment } exact />
              <Route path="/:appId/user-groups" component={ UnderDevelopment } exact />
              <Route path="/:appId/settings" component={ AppSettings } />
              <Route path="*" component={ NotFound } />
            </Switch>
          </AppConsoleShell>
        </Route>
      </Switch>
      <AddAppForm />
    </>
  );
}

export default App;
