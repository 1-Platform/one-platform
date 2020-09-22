import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserDetailsComponent } from './user-profile-components/user-details/user-details.component';
import { UserAuthDetailsComponent } from './user-profile-components/user-auth-details/user-auth-details.component';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { UserAuthItemComponent } from './user-profile-components/user-auth-details/user-auth-item/user-auth-item.component';
import '@one-platform/opc-header/dist/opc-header';
import '@one-platform/opc-footer/dist/opc-footer';

@NgModule( {
  declarations: [
    AppComponent,
    UserDetailsComponent,
    UserAuthDetailsComponent,
    UserAuthItemComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GraphQLModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
  bootstrap: [ AppComponent ],
} )
export class AppModule { }
