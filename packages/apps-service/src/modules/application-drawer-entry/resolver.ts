import { IResolvers } from '@graphql-tools/utils';
import { AuthenticationError, ForbiddenError } from 'apollo-server';
import NotFoundError from '../../utils/not-found-error';
import Projects from '../projects/model';
import ApplicationDrawerEntrys from './model';

const ApplicationsResolver = <IResolvers<ApplicationDrawerEntry, IAppsContext>>{
  Query: {
    apps: (_, { filter, sort = { field: 'createdOn', order: -1 } }) => {
      return ApplicationDrawerEntrys.find(filter)
        .sort({ [sort.field]: sort.order })
        .exec();
    },
    app: (_, { appId }) => {
      return ApplicationDrawerEntrys.findOne(appId).exec();
    },
  },
  Mutation: {
    addAppDrawerEntry: async (_, { projectId, appDrawerEntry }, ctx) => {
      if (!ctx.userId) {
        throw new AuthenticationError('User Not Authenticated');
      }
      const project = await Projects.findOne({ projectId }).exec();
      if (!project) {
        throw new NotFoundError(
          'Project with matching "projectId" does not exist.'
        );
      }

      return new ApplicationDrawerEntrys(appDrawerEntry).save();
    },
    updateAppDrawerEntry: async (
      _,
      { projectId, appId, appDrawerEntry },
      ctx
    ) => {
      if (!ctx.userId) {
        throw new AuthenticationError('User Not Authenticated');
      }
      const project = await Projects.findOne({ projectId }).exec();
      if (!project) {
        throw new NotFoundError(
          'Project with matching "projectId" does not exist.'
        );
      }

      const existingAppDrawerEntry = await ApplicationDrawerEntrys.findOne({
        appId,
      }).exec();
      if (!existingAppDrawerEntry) {
        throw new NotFoundError(`No entry found for appId: "${appId}".`);
      }

      return ApplicationDrawerEntrys.updateOne(
        { appId },
        { ...appDrawerEntry },
        { new: true }
      ).exec();
    },
    deleteAppDrawerEntry: async (_, { projectId, appId }, ctx) => {
      if (!ctx.userId) {
        throw new AuthenticationError('User Not Authenticated');
      }
      const project = await Projects.findOne({ projectId }).exec();
      if (!project) {
        throw new NotFoundError(
          'Project with matching "projectId" does not exist.'
        );
      }

      const appDrawerEntry = await ApplicationDrawerEntrys.findOne({
        appId,
      }).exec();
      if (!appDrawerEntry) {
        throw new NotFoundError(`No entry found for appId: "${appId}".`);
      }

      return ApplicationDrawerEntrys.findOneAndRemove({
        projectId,
        appId,
      }).exec();
    },
    setApplicationAuthentication: async (_, { projectId, appId, value }, { userId }) => {
      if (!userId) {
        throw new AuthenticationError('User Not Authenticated.');
      }

      if (!await Projects.isAuthorized(projectId, userId)) {
        throw new ForbiddenError('User not authorized to change app settings.');
      }

      const project = await Projects.findOne({ projectId }).exec();
      if (!project) {
        throw new NotFoundError('Project with matching "projectId" does not exist.');
      }

      const appDrawerEntry = await ApplicationDrawerEntrys.findOne({
        appId,
      }).exec();
      if (!appDrawerEntry) {
        throw new NotFoundError(`No entry found for appId: "${appId}".`);
      }

      return ApplicationDrawerEntrys.findOneAndUpdate(
        { projectId, appId },
        {
          authenticate: value,
        },
        { new: true }
      ).exec();
    }
  },
};

export default ApplicationsResolver;
