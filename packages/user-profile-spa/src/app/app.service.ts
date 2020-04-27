import { Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { Observable } from 'rxjs';
import { addUserFromLDAP, listUsers } from './user.gql';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  constructor(private apollo: Apollo) {}

  getAllUsers(): Promise<any> {
    return this.apollo
      .watchQuery({ query: listUsers })
      .result()
      .then((res) => _.cloneDeep(res.data));
  }

  /**
   * Created or Get Details of User from LDAP using KerbaroseID
   */
  addUserFromLDAP(kerbaroseID): Observable<any> {
    return this.apollo
      .mutate({ variables: { uid: kerbaroseID }, mutation: addUserFromLDAP })
      .pipe(map((result: any) => result.data));
  }
}
