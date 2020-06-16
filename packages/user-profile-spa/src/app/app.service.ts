import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { updateHomeType, getHomeTypeByUser, getUsersBy } from './user.gql';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor(private apollo: Apollo) {}

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

  /**
   * Created or Get Details of User from LDAP using kerberosID
   */
  updateHomeType(input): Observable<any> {
    return this.apollo
      .mutate({ variables: { input }, mutation: updateHomeType })
      .pipe(map((result: any) => result.data));
  }

  /**
   * Fetches information about the user from user-service
   * @param rhuuid Redhat UUID which is received from SSO
   */
  getUsersBy(rhuuid): Promise<any> {
    return this.apollo
    .watchQuery({ variables: {
      rhuuid
    }, query: getUsersBy })
    .result()
    .then( (res: any) => res.data?.getUsersBy[0] )
    .catch( err => err );
  }
}
