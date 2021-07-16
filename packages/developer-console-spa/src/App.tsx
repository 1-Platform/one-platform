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
import ConfigureFeedback from './components/ConfigureFeedback';
import ConfigureSSI from './components/ConfigureSSI';
import ConfigureDatabase from './components/ConfigureDatabase';
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
              <Route path="/:appId/feedback" component={ ConfigureFeedback } exact />
              <Route path="/:appId/search" component={ UnderDevelopment } exact />
              <Route path="/:appId/notifications" component={ UnderDevelopment } exact />
              <Route path="/:appId/user-groups" component={ UnderDevelopment } exact />
              <Route path="/:appId/settings" component={ AppSettings } exact />
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
