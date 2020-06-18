import { Injectable } from '@angular/core';
import {Apollo} from 'apollo-angular';
import { getNotificationConfigBy, manualNotification, notificationFormData } from './app.gql';
import { GraphQLModule } from './graphql.module';
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

  getNotificationItems(createdBy) {
    return this.apollo
      .watchQuery({
        variables: {
          input: {
            createdBy
          }
        },
        query: getNotificationConfigBy,
      })
      .result()
      .then(result => result.data)
      .catch(err => err);
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
