import * as _ from 'lodash';
import * as async from 'async';
import { User } from './schema';
import * as request from 'request';
import moment from 'moment';
/**
 * @class UserSyncCron
 */
export class UserSyncCron {
  public syncUsers() {
    let dbUsers: any = [];
    let rhatUUIDs: any = [];
    User.find().then((userInfo: any[]) => {
      if (userInfo.length) {
        dbUsers = userInfo;
        rhatUUIDs = userInfo.map(user => user.rhatUUID);
        if (rhatUUIDs.length) {
          async.map(rhatUUIDs, async rhatUUID => {
            return request.get(`${process.env.LDAP_MICROSERVICE}ldap/user/uuid/${rhatUUID}`, {
              rejectUnauthorized: false
            }, (error, resp, body)  => {
              if (body) {
                const response = JSON.parse(body);
                console.log(response.uid);
                const oldProfile = dbUsers.filter((user: any) => user.rhatUUID === rhatUUID);
                const newProfile = oldProfile;
                if (_.isEmpty(response)) {
                  newProfile[0].isActive = false;
                  console.log('Account of ' + rhatUUID + ' de-activated successfully');
                  return Object.assign(oldProfile[0], newProfile[0]).save().then((profile: any) => profile);
                } else {
                  const groups: any = [];
                  response.memberOf.map((group: any) => {
                    groups.push(group.substring(group.indexOf(`cn=`) + 3, group.indexOf(`,`)));
                  });
                  newProfile[0].name = response.cn;
                  newProfile[0].title = response.title;
                  newProfile[0].uid = response.uid;
                  newProfile[0].memberOf = groups;
                  newProfile[0].isActive = true;
                  newProfile[0].timestamp.modifiedAt = moment.utc(new Date());
                  return Object.assign(oldProfile[0], newProfile[0]).save();
                }
              }
            });
          });
        }
      }
    }).catch((err: any) => err);
  }
}
