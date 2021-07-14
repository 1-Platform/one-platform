/* GraphQL resolver implementations */

import { IResolvers } from 'apollo-server';
import { Apps } from '.';
import uniqueIdFromPath from '../../utils/unique-id-from-path';

export default <IResolvers<App, IAppsContext>>{
  Query: {
    apps: ( parent, args, ctx, info ) => {
      return Apps.find().exec();
    },
    myApps: ( parent, args, { rhatUUID } ) => {
      if ( !rhatUUID ) {
        throw new Error( 'Anonymous user unauthorized to view my apps' );
      }
      return Apps.find({ ownerId: rhatUUID }).exec();
    },
    findApps: ( parent, { selectors }, ctx ) => {
      return Apps.find( {...selectors, _id: selectors.id } ).exec();
    },
    app: ( parent, { id, appId } ) => {
      if ( !id && !appId ) {
        throw new Error( 'Please provide atleast one argument for id or appId' );
      }
      return Apps.findOne( { appId, _id: id } ).exec();
    },
  },
  Mutation: {
    createApp: ( parent, { app }, ctx ) => {
      if ( !ctx.rhatUUID ) {
        throw new Error( 'Anonymous user unauthorized to create new app' );
      }
      return new Apps( {
        ...app,
        ownerId: ctx.rhatUUID,
        createdBy: ctx.rhatUUID,
        updatedBy: ctx.rhatUUID,
      } ).save();
    },
    updateApp: ( parent, { id, app }, ctx ) => {
      if ( !Apps.isAuthorized( id, ctx.rhatUUID ) ) {
        throw new Error( 'User unauthorized to update the app' );
      }
      if ( app.path ) {
        app.appId = uniqueIdFromPath( app.path );
      }
      return Apps.findByIdAndUpdate( id, {
        ...app,
        updatedBy: ctx.rhatUUID,
        updatedOn: new Date(),
      }, { new: true } ).exec();
    },
    deleteApp: ( parent, { id }, ctx ) => {
      if ( !Apps.isAuthorized( id, ctx.rhatUUID ) ) {
        throw new Error( 'User unauthorized to delete the app' );
      }
      return Apps.findByIdAndRemove( id ).exec();
    }
  }
}
