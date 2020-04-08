import * as _ from 'lodash';
import * as async from 'async';
import { User } from './schema';
import moment from 'moment';
import { UserGroupAPIHelper } from './helpers';
/**
 * @class UserSyncCron
 */
export class UserSyncCron {
  public syncUsers() {
    User.find().then((userInfo: any[]) => {
      if (userInfo.length) {
        let rhatUUIDs: string[] = [];
        rhatUUIDs = userInfo.map((user: UserType) => user.rhatUUID);
        if (rhatUUIDs.length) {
          async.map(rhatUUIDs, rhatUUID => {
            UserGroupAPIHelper.getProfilesBy(`(rhatUUID=${rhatUUID})`)
            .then((response: any) => {
              const oldProfile = userInfo.filter(user => user.rhatUUID === rhatUUID);
              const newProfile = oldProfile;
              if (_.isEmpty(response)) {
                newProfile[0].isActive = false;
                console.log('Account of ' + oldProfile[0].uid + ' de-activated successfully');
                return User.findByIdAndUpdate(oldProfile[0]._id, newProfile[0], { new: true })
                       .exec();
              } else {
                const groups: string[] = [];
                response.memberOf.map((group: string) => {
                  groups.push(group.substring(group.indexOf(`cn=`) + 3, group.indexOf(`,`)));
                });
                newProfile[0].name = response.cn;
                newProfile[0].title = response.title;
                newProfile[0].uid = response.uid;
                newProfile[0].memberOf = groups;
                newProfile[0].isActive = true;
                newProfile[0].timestamp.modifiedAt = moment(new Date());
                return User.findByIdAndUpdate(oldProfile[0]._id, newProfile[0], { new: true })
                       .exec();
              }
            });
          });
        }
      }
    }).catch((err: any) => err);
  }
}
