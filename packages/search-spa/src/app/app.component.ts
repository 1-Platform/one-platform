import { Component } from '@angular/core';
import '@one-platform/opc-footer/dist/opc-footer';
import '@one-platform/opc-nav/dist/opc-nav';
import '@one-platform/opc-menu-drawer/dist/opc-menu-drawer';
import '@one-platform/opc-notification-drawer/dist/opc-notification-drawer';
import '@one-platform/opc-feedback/dist/opc-feedback';

import opcBase from '@one-platform/opc-base';
import '@one-platform/opc-base/dist/opc-provider';
import { environment } from '../environments/environment';

opcBase.configure({
  apiBasePath: environment.OPCBASE_API_BASE_PATH,
  subscriptionsPath: environment.OPCBASE_SUBSCRIPTION_BASE_PATH,
  keycloakUrl: environment.OPCBASE_KEYCLOAK_URL,
  keycloakClientId: environment.OPCBASE_KEYCLOAK_CLIENT_ID,
  keycloakRealm: environment.OPCBASE_KEYCLOAK_REALM,
});
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Search';
}
