import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { HttpLink, HttpLinkModule } from 'apollo-angular-link-http';
import { GraphQLModule } from './apollo.config';

@Injectable()
export class AppService extends GraphQLModule {
  constructor(
    private apollo: Apollo,
    private httpLink: HttpLink)
  {
    super(apollo, httpLink);
  }
}
