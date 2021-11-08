import { isEmpty } from 'lodash';
import { Users } from './schema';
import { UserGroupAPIHelper } from '../helpers';
import Logger from '../lib/logger';

/**
 * @class UserSyncCron
 */
const UserSyncCron = class {
  static syncUsers(): void {
    Users.find().then((userInfo: any) => {
      if (userInfo.length) {
        const rhatUuids = userInfo.map((user: any) => user.rhatUuid);
        if (rhatUuids.length) {
          rhatUuids.map((rhatUuid: any) => UserGroupAPIHelper.roverFetch(
            `/users/search?filter=((rhatUuid=${rhatUuid}))`,
          ).then(async (res: any) => {
            const response = res?.result[0];
            const oldProfile = userInfo.filter(
              (user: any) => user.rhatUuid === rhatUuid,
            );
            const newProfile: User = { ...response, isActive: true };
            if (isEmpty(response)) {
              newProfile.isActive = false;
              Logger.info(
                `Account of ${oldProfile[0].uid} de-activated successfully`,
              );
              return Users.findByIdAndUpdate(oldProfile[0]._id, newProfile, {
                new: true,
              }).exec();
            }
            newProfile.isActive = true;
            newProfile.updatedOn = new Date();
            return Users.findByIdAndUpdate(oldProfile[0]._id, newProfile, {
              new: true,
            }).exec();
          }));
        }
      }
    });
  }
};

export default UserSyncCron;
