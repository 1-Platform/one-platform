/* GraphQL resolver implementations */

import { IResolvers } from 'apollo-server';
import { Apps } from '.';
import uniqueIdFromPath from '../../utils/unique-id-from-path';
import AppsHelper from '../../utils/apps-helper';
import { createDatabase, deleteDatabase, setDatabasePermissions } from '../../services/couchdb';

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
    createApp: async ( parent, { app }, ctx ) => {
      if ( !ctx.rhatUUID ) {
        throw new Error( 'Anonymous user unauthorized to create new app' );
      }
      const newApp = await new Apps( {
        ...app,
        ownerId: ctx.rhatUUID,
        createdBy: ctx.rhatUUID,
        updatedBy: ctx.rhatUUID,
      } ).save();

      if ( newApp ) {
        const transformedData = AppsHelper.formatSearchInput( newApp );
        AppsHelper.manageSearchIndex( transformedData, 'index' );
      }

      return newApp;
    },
    updateApp: async ( parent, { id, app }, ctx ) => {
      if ( !Apps.isAuthorized( id, ctx.rhatUUID ) ) {
        throw new Error( 'User unauthorized to update the app' );
      }
      if ( app.path ) {
        app.appId = uniqueIdFromPath( app.path );
      }
      const updatedApp = await Apps.findByIdAndUpdate( id, {
        ...app,
        updatedBy: ctx.rhatUUID,
        updatedOn: new Date(),
      }, { new: true } )
        .exec();

      if ( updatedApp ) {
        const transformedData = AppsHelper.formatSearchInput( updatedApp );
        AppsHelper.manageSearchIndex( transformedData, 'index' );
      }

      return updatedApp;
    },
    deleteApp: async ( parent, { id }, ctx ) => {
      if ( !Apps.isAuthorized( id, ctx.rhatUUID ) ) {
        throw new Error( 'User unauthorized to delete the app' );
      }
      const app = await Apps.findByIdAndRemove( id ).exec();

      if ( app ) {
        const input = {
          dataSource: "oneportal",
          documents: [ { 'id': app._id } ]
        };
        AppsHelper.manageSearchIndex( input, 'delete' );
      }

      return app;;
    },
    createAppDatabase: async ( parent, { id, databaseName }, { rhatUUID } ) => {
      if ( !Apps.isAuthorized( id, rhatUUID ) ) {
        throw new Error( 'User unauthorized to create database for the app' );
      }

      const app = await Apps.findById( id );
      if ( !app ) {
        throw new Error( 'App not found' );
      }

      try {
        /* Create the database on couchdb */
        await createDatabase( databaseName );
        /* Set the default permissions */
        /* TODO: Add default users from the app permission model */
        await setDatabasePermissions( databaseName, { admins: [ 'user:' + app.ownerId ], users: [ 'user:' + app.ownerId, 'op-users' ] } );
      } catch ( err ) {
        console.error( '[CouchDB Error]:', JSON.stringify( err ) );
        throw new Error( 'Database could not be created: ' + JSON.stringify(err) );
      }

      const databaseConfig = {
        isEnabled: app.database.isEnabled,
        databases: [
          ...app.database.databases.filter( db => db !== databaseName ),
          databaseName
        ],
      };
      return await app.updateOne( { database: databaseConfig }, { new: true, } ).exec();
    },
    deleteAppDatabase: async ( parent, { id, databaseName }, { rhatUUID } ) => {
      if ( !Apps.isAuthorized( id, rhatUUID ) ) {
        throw new Error( 'User unauthorized to delete database from the app' );
      }

      const app = await Apps.findById( id );
      if ( !app ) {
        throw new Error( 'App not found' );
      }

      try {
        /* Delete the database from couchdb */
        await deleteDatabase( databaseName );
      } catch ( err ) {
        console.error( '[CouchDB Error]:', JSON.stringify( err ) );
        throw new Error( 'Database could not be deleted: ' + JSON.stringify( err ) );
      }

      const databaseConfig = app.database;
      databaseConfig.databases = databaseConfig.databases.filter( db => db !== databaseName );
      return await app.updateOne( { database: databaseConfig }, { new: true } ).exec();
    },
    manageAppDatabase: async ( parent, { id, databaseName, permissions }, { rhatUUID } ) => {
      if ( !Apps.isAuthorized( id, rhatUUID ) ) {
        throw new Error( 'User unauthorized to manage the database' );
      }

      const app = await Apps.findById( id );
      if ( !app ) {
        throw new Error( 'App not found' );
      }

      if ( !app.database.databases.includes( databaseName ) ) {
        throw new Error( `The app does not contain the database "${ databaseName }"` );
      }

      return setDatabasePermissions( databaseName, permissions );
    }
  }
}
