import {Apollo} from 'apollo-angular';
import {HttpLink } from 'apollo-angular-link-http';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {NgPipesModule} from 'ngx-pipes';
import { NgxPaginationModule } from 'ngx-pagination';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';


import { AppService } from './app.service';
import {FeedbackService} from './feedback/feedback.service';
import { FeedbackHomeComponent } from './feedback/home/feedback-home.component';
import {FeedbackItemComponent} from './feedback/feedback-item/feedback-item.component';
import { CountBoxComponent } from './feedback/count-box/count-box.component';
import { DropdownComponent } from './feedback/dropdown/dropdown.component';
import { GraphQLModule } from './graphql.module';
import '@one-platform/opc-footer/dist/opc-footer';
import '@one-platform/opc-header/dist/opc-header';


@NgModule({
  declarations: [
    AppComponent,
    FeedbackHomeComponent,
    FeedbackItemComponent,
    CountBoxComponent,
    DropdownComponent
  ],
  schemas: [
    NO_ERRORS_SCHEMA,
    CUSTOM_ELEMENTS_SCHEMA
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgPipesModule,
    NgxPaginationModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    GraphQLModule
  ],
  providers: [
    AppService,
    Apollo,
    HttpLink,
    FeedbackService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
