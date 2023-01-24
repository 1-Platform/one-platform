import { HttpClientModule } from '@angular/common/http';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgPipesModule } from 'ngx-pipes';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GraphQLModule } from './graphql.module';
import { SearchComponent } from './search/search.component';
import { NgxMatomoTrackerModule } from '@ngx-matomo/tracker';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    SearchComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    GraphQLModule,
    HttpClientModule,
    NgPipesModule,
    NgxMatomoTrackerModule.forRoot( {
      siteId: environment.production === true ? environment.MATOMO_SITE_ID : null,
      trackerUrl: environment.production === true ? environment.MATOMO_URL : '',
      trackAppInitialLoad: true,
      mode: 0
    }),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule { }
