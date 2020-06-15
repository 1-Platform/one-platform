import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { addUserFromLDAP, getHomeTypeByUser } from './user.gql';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor(private apollo: Apollo) {}

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
  addUserFromLDAP(kerbaroseID): Observable<any> {
    return this.apollo
      .mutate({ variables: { uid: kerbaroseID }, mutation: addUserFromLDAP })
      .pipe(map((result: any) => result.data));
  }
}
