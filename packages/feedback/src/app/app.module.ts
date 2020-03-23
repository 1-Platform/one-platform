import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FeedbackModule } from './modules/feedback/feedback.module';
import { HttpClientModule } from '@angular/common/http';
import { Apollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular-link-http';
import { AppService } from './app.service';


@NgModule({
  declarations: [
    AppComponent,
  ],
  schemas: [NO_ERRORS_SCHEMA],
  imports: [
    BrowserModule,
    FeedbackModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    AppService,
    Apollo,
    HttpLink
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
