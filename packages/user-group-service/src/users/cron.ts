
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
        const rhatUUIDs = userInfo.map( ( user: any ) => user.rhatUuid );
        if (rhatUUIDs.length) {
          rhatUUIDs.map((rhatUUID: any) => {
            return UserGroupAPIHelper
              .roverFetch( `/users/search?filter=((rhatUUID=${ rhatUUID }))` )
              .then( async ( res: any ) => {
                const response = res?.result[ 0 ];
                const oldProfile = userInfo.filter( ( user: any ) => user.rhatUuid === rhatUUID );
                const newProfile = response;
                if ( isEmpty(response) ) {
                  newProfile.isActive = false;
                  console.log('Account of ' + oldProfile[0].uid + ' de-activated successfully');
                  return Users.findByIdAndUpdate(oldProfile[0]._id, newProfile, { new: true })
                  .exec();
                } else {
                  newProfile.isActive = true;
                  newProfile.updatedOn = new Date();
                  return Users.findByIdAndUpdate(oldProfile[0]._id, newProfile, { new: true })
                  .exec();
                }
              });
          });
        }
      }
    });
  }
}
