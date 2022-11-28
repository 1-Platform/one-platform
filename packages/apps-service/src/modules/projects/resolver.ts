/* GraphQL resolver implementations */
import { IResolvers } from '@graphql-tools/utils';
import { isEmpty, clone } from 'lodash';
import Projects from './model';
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
    myProjects: (_, args, { userId }) => {
      if (!userId) {
        throw new ForbiddenError('Anonymous user unauthorized to view my apps');
      }
      return Projects.find({ ownerId: userId }).exec();
    },
    findProjects: (_, { selectors }) => {
      return Projects.find({
        ...selectors,
      }).exec();
    },
    project: async (_, { projectId }, { userId }) => {
      if (!await Projects.isAuthorized(projectId, userId)) {
        throw new ForbiddenError('User unauthorized to view the app');
      }
      return Projects.findOne({ projectId }).exec();
    },
  },
  Mutation: {
    createProject: async (_, { project }, { userId }) => {
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
    updateProject: async (_, { projectId, project }, { userId }) => {
      if (!await Projects.isAuthorized(projectId, userId)) {
        throw new ForbiddenError('User unauthorized to update the app');
      }
      const updatedProject = await Projects.findOneAndUpdate(
        { projectId },
        {
          ...project,
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
    deleteProject: async (_, { projectId }, { userId }) => {
      if (!await Projects.isAuthorized(projectId, userId)) {
        throw new ForbiddenError('User unauthorized to delete the app');
      }
      const project = await Projects.findOneAndRemove({projectId}).exec();

      if (project) {
        const input = {
          dataSource: 'oneportal',
          documents: [{ id: projectId }],
        };
        ProjectsHelper.manageSearchIndex(input, 'delete');
      }

      return project;
    },
    transferProjectOwnership: async (
      _,
      { projectId, ownerId },
      { userId }
    ) => {
      const project = await Projects.findOne({ projectId }).exec();
      if (!project) {
        throw new NotFoundError(`Project not found for projectId: "${projectId}"`);
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
        refId: owner.uuid,
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

    newApplication: async (_, { projectId, application }, { userId }) => {
      const project = await Projects.findOne({ projectId }).exec();
      if (!project) {
        throw new NotFoundError(`Project not found for projectId: "${projectId}".`);
      }
      if (project.ownerId !== userId) {
        throw new ForbiddenError('User not authorized.');
      }

      const applications = project.hosting.applications;

      if (
        applications.findIndex((app) => app.name === application.name) !== -1
      ) {
        throw new Error(
          `Application with name "${application.name}" already exists.`
        );
      }
      if (
        applications.findIndex((app) => app.appId === application.appId) !== -1
      ) {
        throw new Error(
          `Application with appId "${application.appId}" already exists.`
        );
      }
      if (
        applications.findIndex((app) => app.url === application.url) !== -1
      ) {
        throw new Error(
          `Application with url "${application.url}" already exists.`
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
      _,
      { projectId, appId, application },
      { userId }
    ) => {
      const project = await Projects.findOne({ projectId }).exec();
      if (!project) {
        throw new NotFoundError(`Project not found for projectId: "${projectId}".`);
      }
      if (project.ownerId !== userId) {
        throw new ForbiddenError('User not authorized.');
      }

      let applications = project.hosting.applications;

      const appIndex = applications.findIndex((app) => app.appId === appId);

      if (appIndex === -1) {
        throw new NotFoundError(`App not found for appId "${appId}".`);
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
    deleteApplication: async (_, { projectId, appId }, { userId }) => {
      const project = await Projects.findOne({ projectId }).exec();
      if (!project) {
        throw new NotFoundError(`Project not found for projectId: "${projectId}"`);
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
      _,
      { projectId, databaseName, description, permissions },
      { userId }
    ) => {
      if (!await Projects.isAuthorized(projectId, userId)) {
        throw new Error('User unauthorized to create database for the app');
      }

      const project = await Projects.findOne({projectId}).exec();
      if (!project) {
        throw new Error('Project not found');
      }

      const dbExists = project.database.databases.findIndex(db => db.name === databaseName) !== -1;
      if (dbExists) {
        throw new Error('Database already exists.');
      }

      const database = {
        name: databaseName,
        description,
        permissions,
      };

      if (isEmpty(database.permissions)) {
        /* TODO: Add default users from the project permissions */
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
    deleteProjectDatabase: async (_, { projectId, databaseName }, { userId }) => {
      if (!await Projects.isAuthorized(projectId, userId)) {
        throw new Error('User unauthorized to delete database from the app');
      }

      const project = await Projects.findOne({projectId}).exec();
      if (!project) {
        throw new Error('Project not found');
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
      _,
      { projectId, databaseName, description, permissions },
      { userId }
    ) => {
      if (!await Projects.isAuthorized(projectId, userId)) {
        throw new ForbiddenError('User unauthorized to manage the database');
      }

      if (!description && isEmpty(permissions)) {
        throw new UserInputError(
          'Provide at least one field: "description" or "permissions".'
        );
      }

      const project = await Projects.findOne({projectId}).exec();
      if (!project) {
        throw new NotFoundError('App not found');
      }

      const databaseConfig = project.database;
      const dbIndex = project.database.databases.findIndex(
        (db) => db.name === databaseName
      );
      if (dbIndex === -1) {
        throw new NotFoundError(
          `The database "${databaseName}" does not exist for the given project.`
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
