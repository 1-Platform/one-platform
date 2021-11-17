/* eslint-disable @typescript-eslint/no-unused-vars */
import { pickBy } from 'lodash';
import { Users } from './schema';
import { UserGroupAPIHelper } from '../helpers';
import Logger from '../lib/logger';

const UserResolver = {
  Query: {
    searchRoverUsers(root: any, args: any, ctx: any) {
      return UserGroupAPIHelper.roverFetch(`/users?criteria=${args.value}&fields=${args.ldapfield}`)
        .then((res: any) => {
          if (args.cacheUser) {
            Users.insertMany(res.result)
              .catch((err) => Logger.error(`Can not insert some users to the Cache.${res.writeErrors && res.writeErrors[0]}, ${res.result}, ${err}`));
          }
          return res.result;
        });
    },
    getUsersBy(root: any, args: any, ctx: any) {
      const input = { uid: args.uid, rhatUuid: args.rhatUUID };
      const cleanedInput = pickBy(input, (v) => v !== undefined);
      return Users.find(cleanedInput)
        .then((users) => {
          if (users.length > 0) {
            return users;
          }

          if (!cleanedInput.uid && !cleanedInput.rhatUuid) {
            throw new Error('User not found for the given input');
          }

          /* Fetch the user from LDAP while adding to the db for future use */
          const key = cleanedInput.rhatUuid ? 'rhatUuid' : 'uid';
          const value = cleanedInput[key];
          return UserGroupAPIHelper
            .roverFetch(`/users/search?filter=((${key}=${value}))`)
            .then((res: any) => {
              const user = res.result[0];
              if (!user) {
                throw new Error(`User not found for the given ${key}`);
              }
              user.isActive = true;
              const data = new Users(user);
              return data.save().then((userInfo: any) => [userInfo]);
            });
        });
    },
    listUsers(root: any, args: any, ctx: any) {
      return Users.find().exec();
    },
  },
  UserType: {
    manager(parent: any, args: any, ctx: any) {
      if (parent.manager) {
        return UserGroupAPIHelper.roverFetch(`/users/${parent.manager.substring(4, parent.manager.indexOf(',ou'))}`)
          .then((res: User) => res);
      }
      return null;
    },
    name(parent: any, args: any, ctx: any) {
      return parent.cn;
    },
    rhatUUID(parent: any, args: any, ctx: any) {
      return parent.rhatUuid;
    },
    title(parent: any, args: any, ctx: any) {
      return parent.rhatJobTitle;
    },
    roverGroups(parent: any, args: any, ctx: any) {
      return UserGroupAPIHelper.roverFetch(`/users/${parent.uid}/groups`)
        .then((res: any) => res.result);
    },
  },
  RoverUserType: {
    manager(parent: any, args: any, ctx: any) {
      if (parent.manager) {
        return UserGroupAPIHelper.roverFetch(`/users/${parent.manager.substring(4, parent.manager.indexOf(',ou'))}`)
          .then((res: User) => res);
      }
      return null;
    },
    name(parent: any, args: any, ctx: any) {
      return parent.cn;
    },
    rhatUUID(parent: any, args: any, ctx: any) {
      return parent.rhatUuid;
    },
    title(parent: any, args: any, ctx: any) {
      return parent.rhatJobTitle;
    },
    roverGroups(parent: any, args: any, ctx: any) {
      return UserGroupAPIHelper.roverFetch(`/users/${parent.uid}/groups`)
        .then((res: any) => res.result);
    },
  },
  Mutation: {
    addUser(root: any, { input }: any, ctx: any) {
      const userInput = input;
      // Reverse mapping to handle familiar names
      userInput.rhatUuid = input.rhatUUID;
      userInput.cn = input.name;
      const data = new Users(input);
      data.isActive = true;
      return data.save();
    },
    addUserFromRover(root: any, { uid }: any, ctx: any) {
      return Users
        .findOne({ uid })
        .exec()
        .then((data: any) => {
          if (data) {
            return data;
          }
          return UserGroupAPIHelper
            .roverFetch(`/users/search?filter=((uid=${uid}))`)
            .then((res: any) => {
              const user = res.result[0];
              user.isActive = true;
              const userData = new Users(user);
              return userData.save().then((userInfo: any) => userInfo);
            });
        });
    },
    deleteUser(root: any, { _id }: any, ctx: any) {
      return Users
        .findByIdAndRemove(_id)
        .exec();
    },
    updateUser(root: any, { input }: any, ctx: any) {
      const userInput = input;
      // Reverse mapping to handle familiar names
      userInput.cn = userInput.name;
      userInput.updatedOn = new Date();
      return Users
        .findOneAndUpdate({ rhatUuid: input.rhatUUID }, input, { new: true })
        .exec();
    },
  },
};

export { UserResolver as default };
