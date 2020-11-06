import {Apollo} from 'apollo-angular';
import {HttpLink,  HttpLinkModule } from 'apollo-angular-link-http';
import { Injectable } from '@angular/core';
import { GraphQLModule } from './graphql.module';

@Injectable()
export class AppService extends GraphQLModule {
  constructor(
    private apollo: Apollo,
    private httpLink: HttpLink) {
    super();
  }
}
