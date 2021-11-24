/* GraphQL resolver implementations */
import { IResolvers } from '@graphql-tools/utils';
import { isEmpty, clone } from 'lodash';
import Apps from './model';
import uniqueIdFromPath from '../../utils/unique-id-from-path';
import AppsHelper from '../../utils/apps-helper';
import { createDatabase, deleteDatabase, setDatabasePermissions } from '../../services/couchdb';
import logger from '../../lib/logger';
import { getUser } from '../../services/user-group';

const AppsResolver = <IResolvers<App, IAppsContext>> {
  Query: {
    apps: () => Apps.find().exec(),
    myApps: (parent, args, { rhatUUID }) => {
      if (!rhatUUID) {
        throw new Error('Anonymous user unauthorized to view my apps');
      }
      return Apps.find({ ownerId: rhatUUID }).exec();
    },
    findApps: (parent, { selectors }) => {
      const appSelector = selectors;
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const _id = appSelector.id;
      delete appSelector.id;

      return Apps.find({
        ...selectors,
        ...(_id && { _id }),
      }).exec();
    },
    app: (parent, { id, appId }) => {
      if (!id && !appId) {
        throw new Error('Please provide atleast one argument for id or appId');
      }
      return Apps.findOne({
        ...(appId && { appId }),
        ...(id && { _id: id }),
      }).exec();
    },
  },
  Mutation: {
    createApp: async (parent, { app }, ctx) => {
      if (!ctx.rhatUUID) {
        throw new Error('Anonymous user unauthorized to create new app');
      }
      const newApp = await new Apps({
        ...app,
        name: app.name.trim(),
        description: app.description.trim(),
        ownerId: ctx.rhatUUID,
        createdBy: ctx.rhatUUID,
        updatedBy: ctx.rhatUUID,
      }).save();

      if (newApp) {
        const transformedData = AppsHelper.formatSearchInput(newApp);
        AppsHelper.manageSearchIndex(transformedData, 'index');
      }

      return newApp;
    },
    updateApp: async (parent, { id, app }, ctx) => {
      const appRecord = app;
      if (!Apps.isAuthorized(id, ctx.rhatUUID)) {
        throw new Error('User unauthorized to update the app');
      }
      if (appRecord.path) {
        appRecord.appId = uniqueIdFromPath(app.path);
      }
      const updatedApp = await Apps
        .findByIdAndUpdate(id, {
          ...appRecord,
          updatedBy: ctx.rhatUUID,
          updatedOn: new Date(),
        }, { new: true })
        .exec();

      if (updatedApp) {
        const transformedData = AppsHelper.formatSearchInput(updatedApp);
        AppsHelper.manageSearchIndex(transformedData, 'index');
      }

      return updatedApp;
    },
    deleteApp: async (parent, { id }, ctx) => {
      if (!Apps.isAuthorized(id, ctx.rhatUUID)) {
        throw new Error('User unauthorized to delete the app');
      }
      const app = await Apps.findByIdAndRemove(id).exec();

      if (app) {
        const input = {
          dataSource: 'oneportal',
          documents: [{ id: app._id }],
        };
        AppsHelper.manageSearchIndex(input, 'delete');
      }

      return app;
    },
    transferAppOwnership: async (parent, { id, ownerId }, { rhatUUID }) => {
      if (!Apps.isAuthorized(id, rhatUUID)) {
        throw new Error('User unauthorized to transfer ownership');
      }
      const app = await Apps.findById(id).exec();
      if (!app) {
        throw new Error(`App not found for id: "${id}"`);
      }
      if (app.ownerId !== rhatUUID) {
        throw new Error('User not authorized to transfer ownership.');
      }
      if (app.ownerId === ownerId) {
        return app;
      }

      const owner = await getUser(app.ownerId);
      const newOwner = await getUser(ownerId);
      if (!owner || !newOwner) {
        throw new Error('There was some problem. Please try again.');
      }

      let permissions = clone(app.permissions);
      /* Make the previous owner an editor */
      permissions.unshift({
        name: owner.name,
        email: owner.email,
        refId: owner.uuid,
        refType: App.PermissionsRefType.USER,
        role: App.PermissionsRole.EDIT,
      });
      /* Remove duplicates, if any */
      permissions = permissions
        .filter((permission, index, arr) => (
          arr.findIndex((perm) => perm.refId === permission.refId) === index
          && permission.refId !== ownerId
        ));

      return Apps.findByIdAndUpdate(id, {
        ownerId,
        permissions,
        updatedOn: new Date(),
        updatedBy: rhatUUID,
      }, { new: true }).exec();
    },
    createAppDatabase: async (parent, {
      id, databaseName, description, permissions,
    }, { rhatUUID }) => {
      if (!Apps.isAuthorized(id, rhatUUID)) {
        throw new Error('User unauthorized to create database for the app');
      }

      const app = await Apps.findById(id);
      if (!app) {
        throw new Error('App not found');
      }
      const database = {
        name: databaseName,
        description,
        permissions,
      };

      if (isEmpty(database.permissions)) {
        /* TODO: Add default users from the app permission model */
        database.permissions = { admins: [`user:${app.ownerId}`], users: [`user:${app.ownerId}`, 'op-users'] };
      }

      try {
        /* Create the database on couchdb */
        await createDatabase(database.name);
        /* Set the default permissions */
        await setDatabasePermissions(database.name, database.permissions);
      } catch (err) {
        logger.error('[CouchDB Error]:', JSON.stringify(err));
        throw new Error(`Database could not be created: ${JSON.stringify(err)}`);
      }

      const databaseConfig = {
        isEnabled: app.database.isEnabled,
        databases: [
          ...app.database.databases.filter((db) => db.name !== databaseName),
          database,
        ],
      };
      return Apps.findByIdAndUpdate(app.id, { database: databaseConfig }, { new: true }).exec();
    },
    deleteAppDatabase: async (parent, { id, databaseName }, { rhatUUID }) => {
      if (!Apps.isAuthorized(id, rhatUUID)) {
        throw new Error('User unauthorized to delete database from the app');
      }

      const app = await Apps.findById(id);
      if (!app) {
        throw new Error('App not found');
      }

      try {
        /* Delete the database from couchdb */
        await deleteDatabase(databaseName);
      } catch (err) {
        logger.error('[CouchDB Error]:', JSON.stringify(err));
        throw new Error(`Database could not be deleted: ${JSON.stringify(err)}`);
      }

      const databaseConfig = app.database;
      databaseConfig.databases = databaseConfig.databases.filter((db) => db.name !== databaseName);
      return Apps.findByIdAndUpdate(app.id, { database: databaseConfig }, { new: true }).exec();
    },
    manageAppDatabase: async (parent, {
      id, databaseName, description, permissions,
    }, { rhatUUID }) => {
      if (!Apps.isAuthorized(id, rhatUUID)) {
        throw new Error('User unauthorized to manage the database');
      }

      if (!description && isEmpty(permissions)) {
        throw new Error('Provide at least one field: "description" or "permissions".');
      }

      const app = await Apps.findById(id);
      if (!app) {
        throw new Error('App not found');
      }

      const databaseConfig = app.database;
      const dbIndex = app.database.databases.findIndex((db) => db.name === databaseName);
      if (dbIndex === -1) {
        throw new Error(`The database "${databaseName}" does not exist for the given app.`);
      }

      if (description) {
        databaseConfig.databases[dbIndex].description = description;
      }

      if (permissions) {
        await setDatabasePermissions(databaseConfig.databases[dbIndex].name, permissions);
        databaseConfig.databases[dbIndex].permissions = permissions;
      }

      return Apps.findByIdAndUpdate(app.id, { database: databaseConfig }, { new: true }).exec();
    },
  },
};

export { AppsResolver as default };
