/* GraphQL resolver implementations */
import { IResolvers } from '@graphql-tools/utils';
import { isEmpty, clone } from 'lodash';
import Projects from './model';
import uniqueIdFromPath from '../../utils/unique-id-from-path';
import ProjectsHelper from '../../utils/apps-helper';
import {
  createDatabase,
  deleteDatabase,
  setDatabasePermissions,
} from '../../services/couchdb';
import logger from '../../lib/logger';
import { getUser } from '../../services/user-group';
import NotFoundError from '../../utils/not-found-error';
import { ForbiddenError, UserInputError } from 'apollo-server';

const ProjectsResolver = <IResolvers<Project, IAppsContext>>{
  Query: {
    projects: () => Projects.find().exec(),
    myProjects: (parent, args, { userId }) => {
      if (!userId) {
        throw new ForbiddenError('Anonymous user unauthorized to view my apps');
      }
      return Projects.find({ ownerId: userId }).exec();
    },
    findProjects: (parent, { selectors }) => {
      const appSelector = selectors;
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const _id = appSelector.id;
      delete appSelector.id;

      return Projects.find({
        ...selectors,
        ...(_id && { _id }),
      }).exec();
    },
    project: (parent, { id, projectId }) => {
      if (!id && !projectId) {
        throw new UserInputError(
          'Please provide atleast one argument for id or projectId'
        );
      }
      return Projects.findOne({
        ...(projectId && { projectId }),
        ...(id && { _id: id }),
      }).exec();
    },
  },
  Mutation: {
    createProject: async (parent, { project }, { userId }) => {
      if (!userId) {
        throw new ForbiddenError(
          'Anonymous user unauthorized to create new app'
        );
      }
      const newProject = await new Projects({
        ...project,
        name: project.name.trim(),
        description: project.description.trim(),
        ownerId: userId,
        createdBy: userId,
        updatedBy: userId,
      }).save();

      if (newProject) {
        const transformedData = ProjectsHelper.formatSearchInput(newProject);
        ProjectsHelper.manageSearchIndex(transformedData, 'index');
      }

      return newProject;
    },
    updateProject: async (parent, { id, project }, { userId }) => {
      const projectRecord = project;
      if (!Projects.isAuthorized(id, userId)) {
        throw new ForbiddenError('User unauthorized to update the app');
      }
      if (projectRecord.path) {
        projectRecord.projectId = uniqueIdFromPath(project.path);
      }
      const updatedProject = await Projects.findByIdAndUpdate(
        id,
        {
          ...projectRecord,
          updatedBy: userId,
          updatedOn: new Date(),
        },
        { new: true }
      ).exec();

      if (updatedProject) {
        const transformedData =
          ProjectsHelper.formatSearchInput(updatedProject);
        ProjectsHelper.manageSearchIndex(transformedData, 'index');
      }

      return updatedProject;
    },
    deleteProject: async (parent, { id }, { userId }) => {
      if (!Projects.isAuthorized(id, userId)) {
        throw new ForbiddenError('User unauthorized to delete the app');
      }
      const project = await Projects.findByIdAndRemove(id).exec();

      if (project) {
        const input = {
          dataSource: 'oneportal',
          documents: [{ id: project._id }],
        };
        ProjectsHelper.manageSearchIndex(input, 'delete');
      }

      return project;
    },
    transferProjectOwnership: async (
      parent,
      { projectId, ownerId },
      { userId }
    ) => {
      const project = await Projects.findOne({ projectId }).exec();
      if (!project) {
        throw new NotFoundError(`Project not found for id: "${projectId}"`);
      }
      if (project.ownerId !== userId) {
        throw new ForbiddenError('User not authorized to transfer ownership.');
      }
      if (project.ownerId === ownerId) {
        return project;
      }

      const owner = await getUser(project.ownerId);
      const newOwner = await getUser(ownerId);
      if (!owner || !newOwner) {
        throw new Error('There was some problem. Please try again.');
      }

      let permissions = clone(project.permissions);
      /* Make the previous owner an editor */
      permissions.unshift({
        name: owner.name,
        email: owner.email,
        refId: owner.uuserId,
        refType: Project.PermissionsRefType.USER,
        role: Project.PermissionsRole.EDIT,
      });
      /* Remove duplicates, if any */
      permissions = permissions.filter(
        (permission, index, arr) =>
          arr.findIndex((perm) => perm.refId === permission.refId) === index &&
          permission.refId !== ownerId
      );

      return Projects.findOneAndUpdate(
        { projectId },
        {
          ownerId,
          permissions,
          updatedOn: new Date(),
          updatedBy: userId,
        },
        { new: true }
      ).exec();
    },

    newApplication: async (parent, { projectId, application }, { userId }) => {
      const project = await Projects.findOne({ projectId }).exec();
      if (!project) {
        throw new NotFoundError(`Project not found for id: "${projectId}"`);
      }
      if (project.ownerId !== userId) {
        throw new ForbiddenError('User not authorized.');
      }

      const applications = project.hosting.applications;

      if (
        applications.findIndex((app) => app.name === application.name) !== -1
      ) {
        throw new Error(
          `Application with name "${application.name}" already exists`
        );
      }
      if (
        applications.findIndex((app) => app.appId === application.appId) !== -1
      ) {
        throw new Error(
          `Application with appId "${application.appId}" already exists`
        );
      }
      if (
        applications.findIndex((app) => app.path === application.path) !== -1
      ) {
        throw new Error(
          `Application with path "${application.path}" already exists`
        );
      }

      applications.push(application);

      return Projects.findOneAndUpdate(
        { projectId },
        {
          hosting: {
            isEnabled: project.hosting.isEnabled,
            applications,
          },
        },
        { new: true }
      ).exec();
    },
    updateApplication: async (
      parent,
      { projectId, appId, application },
      { userId }
    ) => {
      const project = await Projects.findOne({ projectId }).exec();
      if (!project) {
        throw new NotFoundError(`Project not found for id: "${projectId}"`);
      }
      if (project.ownerId !== userId) {
        throw new ForbiddenError('User not authorized.');
      }

      let applications = project.hosting.applications;

      const appIndex = applications.findIndex((app) => app.appId === appId);

      if (appIndex === -1) {
        throw new NotFoundError(`App not found for appId "${appId}"`);
      }

      applications[appIndex] = {
        ...applications[appIndex],
        ...application,
      };

      return Projects.findOneAndUpdate(
        { projectId },
        {
          hosting: {
            isEnabled: project.hosting.isEnabled,
            applications,
          },
        },
        { new: true }
      ).exec();
    },
    deleteApplication: async (parent, { projectId, appId }, { userId }) => {
      const project = await Projects.findOne({ projectId }).exec();
      if (!project) {
        throw new NotFoundError(`Project not found for id: "${projectId}"`);
      }
      if (project.ownerId !== userId) {
        throw new ForbiddenError('User not authorized.');
      }

      const applications = project.hosting.applications;
      const appIndex = applications.findIndex((app) => app.appId === appId);
      if (appIndex === -1) {
        throw new NotFoundError(`App not found for appId "${appId}"`);
      }

      applications.splice(appIndex, 1);

      return Projects.findOneAndUpdate(
        { projectId },
        {
          hosting: {
            isEnabled: project.hosting.isEnabled,
            applications,
          },
        },
        { new: true }
      ).exec();
    },

    createProjectDatabase: async (
      parent,
      { id, databaseName, description, permissions },
      { userId }
    ) => {
      if (!Projects.isAuthorized(id, userId)) {
        throw new Error('User unauthorized to create database for the app');
      }

      const project = await Projects.findById(id);
      if (!project) {
        throw new Error('App not found');
      }
      const database = {
        name: databaseName,
        description,
        permissions,
      };

      if (isEmpty(database.permissions)) {
        /* TODO: Add default users from the app permission model */
        database.permissions = {
          admins: [`user:${project.ownerId}`],
          users: [`user:${project.ownerId}`, 'op-users'],
        };
      }

      try {
        /* Create the database on couchdb */
        await createDatabase(database.name);
        /* Set the default permissions */
        await setDatabasePermissions(database.name, database.permissions);
      } catch (err) {
        logger.error('[CouchDB Error]:', JSON.stringify(err));
        throw new Error(
          `Database could not be created: ${JSON.stringify(err)}`
        );
      }

      const databaseConfig = {
        isEnabled: project.database.isEnabled,
        databases: [
          ...project.database.databases.filter(
            (db) => db.name !== databaseName
          ),
          database,
        ],
      };
      return Projects.findByIdAndUpdate(
        project.id,
        { database: databaseConfig },
        { new: true }
      ).exec();
    },
    deleteProjectDatabase: async (parent, { id, databaseName }, { userId }) => {
      if (!Projects.isAuthorized(id, userId)) {
        throw new Error('User unauthorized to delete database from the app');
      }

      const project = await Projects.findById(id);
      if (!project) {
        throw new Error('App not found');
      }

      try {
        /* Delete the database from couchdb */
        await deleteDatabase(databaseName);
      } catch (err) {
        logger.error('[CouchDB Error]:', JSON.stringify(err));
        throw new Error(
          `Database could not be deleted: ${JSON.stringify(err)}`
        );
      }

      const databaseConfig = project.database;
      databaseConfig.databases = databaseConfig.databases.filter(
        (db) => db.name !== databaseName
      );
      return Projects.findByIdAndUpdate(
        project.id,
        { database: databaseConfig },
        { new: true }
      ).exec();
    },
    manageProjectDatabase: async (
      parent,
      { id, databaseName, description, permissions },
      { userId }
    ) => {
      if (!Projects.isAuthorized(id, userId)) {
        throw new ForbiddenError('User unauthorized to manage the database');
      }

      if (!description && isEmpty(permissions)) {
        throw new UserInputError(
          'Provide at least one field: "description" or "permissions".'
        );
      }

      const project = await Projects.findById(id);
      if (!project) {
        throw new NotFoundError('App not found');
      }

      const databaseConfig = project.database;
      const dbIndex = project.database.databases.findIndex(
        (db) => db.name === databaseName
      );
      if (dbIndex === -1) {
        throw new NotFoundError(
          `The database "${databaseName}" does not exist for the given app.`
        );
      }

      if (description) {
        databaseConfig.databases[dbIndex].description = description;
      }

      if (permissions) {
        await setDatabasePermissions(
          databaseConfig.databases[dbIndex].name,
          permissions
        );
        databaseConfig.databases[dbIndex].permissions = permissions;
      }

      return Projects.findByIdAndUpdate(
        project.id,
        { database: databaseConfig },
        { new: true }
      ).exec();
    },
  },
};

export { ProjectsResolver as default };
