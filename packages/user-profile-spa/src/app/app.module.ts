import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './user-profile-components/header/header.component';
import { UserDetailsComponent } from './user-profile-components/user-details/user-details.component';
import { UserAuthDetailsComponent } from './user-profile-components/user-auth-details/user-auth-details.component';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { UserAuthItemComponent } from './user-profile-components/user-auth-details/user-auth-item/user-auth-item.component';

@NgModule( {
  declarations: [ AppComponent, HeaderComponent, UserDetailsComponent, UserAuthDetailsComponent, UserAuthItemComponent ],
  imports: [ BrowserModule, AppRoutingModule, GraphQLModule, HttpClientModule, FormsModule ],
  providers: [],
  bootstrap: [ AppComponent ],
} )
export class AppModule { }
