import { Injectable } from '@angular/core';
import {Apollo} from 'apollo-angular';
import { listNotificationItems, manualNotification, notificationFormData } from './app.gql';
import { GraphQLModule } from './graphql.module';
import { notificationItemsMock } from './mocks/notificationItems.mock';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppService extends GraphQLModule {

  constructor(
    private apollo: Apollo,
  ) {
    super();
  }

  getNotificationItems() {
    return this.apollo
      .watchQuery({
        query: listNotificationItems,
      })
      .result()
      .then(result => result.data)
      .catch(err => {
        if (err) {
          return notificationItemsMock;
        }
      });
  }

  sendManualNotification(modalFormData) {
    return this.apollo
      .mutate({
        variables: { input: modalFormData }, mutation: manualNotification
      })
      .pipe(map (result => result.data ));
  }

  sendNotificationFormData(modalFormData) {
    return this.apollo
      .mutate({
        variables: { input: modalFormData }, mutation: notificationFormData
      })
      .pipe(map (result => result.data ));
  }
}
