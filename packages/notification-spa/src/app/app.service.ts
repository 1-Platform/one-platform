import { Injectable } from '@angular/core';
import {Apollo} from 'apollo-angular';
import {
  getNotificationConfigBy,
  createNotificationConfig,
  deleteNotificationConfig,
  updateNotificationConfig,
  getHomeTypeByUser
} from './app.gql';
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

  /**
   * Fetches information from the Home-Service about which entities are owned by User
   * @param rhuuid Redhat UUID which is received from SSO
   */
  getHomeTypeByUser(rhuuid: string): Promise<any> {
    return this.apollo
      .watchQuery({ variables: {
        rhuuid
      }, query: getHomeTypeByUser })
      .result()
      .then( (res: any) => res.data.getHomeTypeByUser )
      .catch( err => err );
  }

  getNotificationConfigBy(input: any) {
    return this.apollo
      .watchQuery({
        variables: {
          input
        },
        query: getNotificationConfigBy,
      })
      .result()
      .then((result: any) => result.data.getNotificationConfigsBy)
      .catch(err => err);
  }

  createNotificationConfig(input: NotificationConfig) {
    return this.apollo
      .mutate({ variables: { input }, mutation: createNotificationConfig })
      .pipe(map (result => result.data ));
  }

  updateNotificationConfig(input: NotificationConfig) {
    return this.apollo
    .mutate({ variables: { input }, mutation: updateNotificationConfig })
    .pipe(map (results => results.data ));
  }

  deleteNotificationConfig(id: string) {
    return this.apollo
    .mutate({ variables: { id }, mutation: deleteNotificationConfig })
    .pipe(map (results => results.data ));
  }
}
