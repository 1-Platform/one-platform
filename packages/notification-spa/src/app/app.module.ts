import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { IndexComponent } from './index/index.component';
import { ManageNotificationComponent } from './manage-notification/manage-notification.component';
import { SidePanelComponent } from './side-panel/side-panel.component';
import { SpaNotificationsListComponent } from './index/spa-notifications-list/spa-notifications-list.component';

import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import '@one-platform/opc-footer/dist/opc-footer';
import '@one-platform/opc-header/dist/opc-header';

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    ManageNotificationComponent,
    SidePanelComponent,
    SpaNotificationsListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    GraphQLModule,
    HttpClientModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
