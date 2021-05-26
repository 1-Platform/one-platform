
import { Users } from './schema';
import moment from 'moment';
import { UserGroupAPIHelper } from '../helpers';
import { isEmpty } from 'lodash';

/**
 * @class UserSyncCron
 */
export class UserSyncCron {
  public syncUsers() {
    Users.find().then((userInfo: any) => {
      if ( userInfo.length ) {
        const rhatUUIDs = userInfo.map( ( user: any ) => user.rhatUUID );
        if (rhatUUIDs.length) {
          rhatUUIDs.map((rhatUUID: any) => {
            return UserGroupAPIHelper
              .roverFetch( `/users/search?filter=((rhatUUID=${ rhatUUID }))` )
              .then( async ( res: any ) => {
                const response = res.result?.result[ 0 ];
                const oldProfile = userInfo.filter((user: any) => user.rhatUUID === rhatUUID);
                const newProfile = oldProfile;
                if ( isEmpty(response) ) {
                  newProfile[0].isActive = false;
                  console.log('Account of ' + oldProfile[0].uid + ' de-activated successfully');
                  return Users.findByIdAndUpdate(oldProfile[0]._id, newProfile[0], { new: true })
                  .exec();
                } else {
                  newProfile[0].name = response.cn;
                  newProfile[0].title = response.rhatJobTitle;
                  newProfile[0].uid = response.uid;
                  newProfile[0].isActive = true;
                  newProfile[0].updatedOn = new Date();
                  return Users.findByIdAndUpdate(oldProfile[0]._id, newProfile[0], { new: true })
                  .exec();
                }
              });
          });
        }
      }
    });
  }
}
