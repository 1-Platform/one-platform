import { v4 as uuidv4 } from 'uuid';
import { Groups } from '../groups/schema';
import { Users } from '../users/schema';
import { APIKeys } from './schema';
import { hash } from './util';

export const APIKeysResolver = {
  Query: {
    listAPIKeys ( parent: any, { limit = -1 }: GraphQLArgs ) {
      return APIKeys
        .find()
        .limit( limit )
        .exec();
    },
    getAPIKeysBy ( parent: any, { selector, limit = -1 }: GraphQLArgs ) {
      return APIKeys
        .find( selector )
        .limit( limit )
        .exec();
    },
    async validateAPIKey ( parent: any, { accessToken }: GraphQLArgs ) {
      const hashKey = hash( accessToken );
      const key = await APIKeys
        .findOne( { hashKey } )
        .exec();

      if ( !key ) {
        throw new Error( 'Invalid API Key' );
      }

      if ( key.expiresOn && key.expiresOn.getTime() < new Date().getTime() ) {
        throw new Error( 'API Key has expired' );
      }

      return key;
    },
  },
  Mutation: {
    createAPIKey ( parent: any, { apiKey }: GraphQLArgs, ctx: any ) {
      const accessToken = uuidv4();

      return new APIKeys( {
        ...apiKey,
        accessToken,
        createdOn: new Date(),
        createdBy: ctx.rhatUUID,
      } )
        .save();
    },
    changeAPIKeyPermissions ( parent: any, { id, access }: GraphQLArgs, ctx: any ) {
      return APIKeys
        .findByIdAndUpdate( id, {
          access,
          updatedOn: new Date(),
          updatedBy: ctx.rhatUUID,
        }, { new: true } )
        .exec();
    },
    revokeAPIKey ( parent: any, { id }: GraphQLArgs, ctx: any ) {
      const accessToken = uuidv4();
      const hashKey = hash( accessToken );

      return APIKeys
        .findByIdAndUpdate( id, {
          accessToken,
          hashKey,
          updatedOn: new Date(),
          updateBy: ctx.rhatUUID,
        }, { new: true } )
        .exec();
    },
    deleteAPIKey ( parent: any, { id }: GraphQLArgs ) {
      return APIKeys
        .findByIdAndRemove( id )
        .exec();
    }
  },
  APIKey: {
    owner ( parent: APIKey ) {
      if ( parent.ownerType === 'Group' ) {
        return Groups
          .findById( parent.owner )
          .exec();
      } else {
        return Users
          .findOne( { rhatUUID: parent.owner } )
          .exec();
      }
    }
  },
  APIKeyOwner: {
    __resolveType ( owner: any ) {
      /* WKRD: Find a better identifier to differentiate UserType and Group */
      if ( !owner.rhatUUID ) {
        return 'Group';
      } else {
        return 'UserType';
      }
    },
  }
};
