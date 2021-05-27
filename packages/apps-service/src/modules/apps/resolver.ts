/* GraphQL resolver implementations */

import { IResolvers } from 'apollo-server';
import { Apps } from '.';

export default <IResolvers<App, IAppsContext>>{
  Query: {
    apps: ( parent, args, ctx, info ) => {
      return Apps.find().exec();
    },
    myApps: ( parent, args, ctx ) => {
      if ( !ctx.rhatUUID ) {
        throw new Error( 'User unauthorized to view my apps' );
      }
      return Apps.find().where( 'owner', ctx.rhatUUID ).exec();
    },
    app: ( parent, { selectors }, ctx ) => {
      return Apps.find( selectors ).exec();
    }
  },
  Mutation: {
    createApp: ( parent, { app }, ctx ) => {
      if ( !ctx.rhatUUID ) {
        throw new Error( 'User unauthorized to create new app' );
      }
      return new Apps( {
        ...app,
        owner: ctx.rhatUUID,
        createdBy: ctx.rhatUUID,
        updatedBy: ctx.rhatUUID,
      } ).save();
    },
    updateApp: ( parent, { id, app }, ctx ) => {
      if ( !Apps.isAuthorized( id, ctx.rhatUUID ) ) {
        throw new Error( 'User unauthorized to update app' );
      }
      return Apps.findByIdAndUpdate( id, {
        ...app,
        updatedBy: ctx.rhatUUID,
        updatedOn: new Date(),
      }, { new: true } ).exec();
    },
    deleteApp: ( parent, { id }, ctx ) => {
      if ( !Apps.isAuthorized( id, ctx.rhatUUID ) ) {
        throw new Error( 'User unauthorized to update app' );
      }
      return Apps.findByIdAndRemove( id ).exec();
    }
  }
}
