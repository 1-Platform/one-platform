/* GraphQL resolver implementations */

import { IResolvers } from 'apollo-server';
import { Apps } from '.';
import uniqueIdFromPath from '../../utils/unique-id-from-path';
import AppsHelper from '../../utils/apps-helper';

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
      const _id = selectors.id;
      delete selectors.id;

      return Apps.find( {
        ...selectors,
        ...( _id && { _id } ),
      } ).exec();
    },
    app: ( parent, { id, appId } ) => {
      if ( !id && !appId ) {
        throw new Error( 'Please provide atleast one argument for id or appId' );
      }
      return Apps.findOne( {
        ...( appId && { appId } ),
        ...( id && { _id: id } ),
      } ).exec();
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
      } ).save()
        .then( ( res: any ) => {
          const transformedData = AppsHelper.formatSearchInput( res );
          AppsHelper.manageSearchIndex(transformedData, 'index');
          return res;
        });
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
      }, { new: true } )
        .exec()
        .then( ( res: any ) => {
          const transformedData = AppsHelper.formatSearchInput( res );
          AppsHelper.manageSearchIndex(transformedData, 'index');
          return res;
        });
    },
    deleteApp: ( parent, { id }, ctx ) => {
      if ( !Apps.isAuthorized( id, ctx.rhatUUID ) ) {
        throw new Error( 'User unauthorized to delete the app' );
      }
      return Apps.findByIdAndRemove( id )
        .exec()
        .then( ( res: any ) => {
          const input = {
            dataSource: "oneportal",
            documents: [ { 'id': res._id } ]
          };
          AppsHelper.manageSearchIndex(input, 'delete');
          return res;
        });;
    }
  }
}
