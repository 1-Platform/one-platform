import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import '@one-platform/opc-footer/dist/opc-footer';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql.module';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxMatomoTrackerModule } from '@ngx-matomo/tracker';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    GraphQLModule,
    HttpClientModule,
    SharedModule,
    BrowserAnimationsModule,
    NgxMatomoTrackerModule.forRoot({
      siteId: environment.production === true ? environment.MATOMO_SITE_ID : null,
      trackerUrl: environment.production === true ? environment.MATOMO_URL : '',
      trackAppInitialLoad: true,
      mode: 0,
    }),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
