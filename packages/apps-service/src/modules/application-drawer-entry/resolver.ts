import { IResolvers } from '@graphql-tools/utils';
import { AuthenticationError } from 'apollo-server';
import NotFoundError from '../../utils/not-found-error';
import Projects from '../projects/model';
import ApplicationDrawerEntrys from './model';

const ApplicationsResolver = <IResolvers<ApplicationDrawerEntry, IAppsContext>>{
  Query: {
    apps: (_, { filter, sort }) => {
      return ApplicationDrawerEntrys.find(filter)
        .sort({ [sort.field]: sort.order })
        .exec();
    },
    app: (_, { appId }) => {
      return ApplicationDrawerEntrys.findOne(appId).exec();
    },
  },
  Mutation: {
    addAppDrawerEntry: async (_, { projectId, appDrawerEntry}, ctx) => {
      if (!ctx.userId) {
        throw new AuthenticationError('User Not Authenticated');
      }
      const project = await Projects.findOne({ projectId }).exec();
      if (!project) {
        throw new NotFoundError(
          'Project with matching "projectId" does not exist.'
        );
      }

      return new ApplicationDrawerEntrys(
        appDrawerEntry
      ).save();
    },
    updateAppDrawerEntry: async (_, { projectId, appId, appDrawerEntry }, ctx) => {
      if (!ctx.userId) {
        throw new AuthenticationError('User Not Authenticated');
      }
      const project = await Projects.findOne({ projectId }).exec();
      if (!project) {
        throw new NotFoundError(
          'Project with matching "projectId" does not exist.'
        );
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

      return ApplicationDrawerEntrys.findOneAndRemove({
        projectId,
        appId,
      }).exec();
    }
    // newApp: async (_, { projectId, app }, ctx) => {
    //   if (!ctx.userId) {
    //     throw new AuthenticationError('User Not Authenticated');
    //   }
    //   const project = await Projects.findOne({ projectId }).exec();
    //   if (!project) {
    //     throw new NotFoundError(
    //       'Project with matching "projectId" does not exist.'
    //     );
    //   }

    //   const application = new Applications({ ...app, projectId: project.id });
    //   await application.validate();

    //   const hosting = project.hosting;
    //   if (!hosting.applications) {
    //     hosting.applications = [];
    //   }
    //   hosting.applications.push(application._id);

    //   await project.updateOne({ hosting });
    //   return await application.save();
    // },
    // updateApp: async (_, { projectId, appId, app }, ctx) => {
    //   if (!ctx.userId) {
    //     throw new AuthenticationError('User Not Authenticated');
    //   }
    //   const project = await Projects.findOne({ projectId }).exec();
    //   if (!project) {
    //     throw new NotFoundError(
    //       'Project with matching "projectId" does not exist.'
    //     );
    //   }

    //   const application = await Applications.findOne({ appId }).exec();
    //   if (!application) {
    //     throw new NotFoundError(
    //       'Application with matching "appId" does not exist.'
    //     );
    //   }

    //   if (
    //     project.hosting.applications.findIndex(
    //       (id) => id === application._id
    //     ) === -1
    //   ) {
    //     throw new NotFoundError(
    //       'The Project does not contain any application matching the "appId"'
    //     );
    //   }

    //   return await application.updateOne({ ...app }, { new: true }).exec();
    // },
    // deleteApp: async (_, { projectId, appId }, ctx) => {
    //   if (!ctx.userId) {
    //     throw new AuthenticationError('User Not Authenticated');
    //   }
    //   const project = await Projects.findOne({ projectId }).exec();
    //   if (!project) {
    //     throw new NotFoundError(
    //       'Project with matching "projectId" does not exist.'
    //     );
    //   }

    //   const application = await Applications.findOne({ appId }).exec();
    //   if (!application) {
    //     throw new NotFoundError(
    //       'Application with matching "appId" does not exist.'
    //     );
    //   }

    //   if (
    //     project.hosting.applications.findIndex(
    //       (id) => id === application._id
    //     ) === -1
    //   ) {
    //     throw new NotFoundError(
    //       'The Project does not contain any application matching the "appId"'
    //     );
    //   }

    //   return application.remove();
    // },
    // setAppAuthentication: async (_, { projectId, appId, value }, ctx) => {
    //   if (!ctx.userId) {
    //     throw new AuthenticationError('User Not Authenticated');
    //   }
    //   const project = await Projects.findOne({ projectId }).exec();
    //   if (!project) {
    //     throw new NotFoundError(
    //       'Project with matching "projectId" does not exist.'
    //     );
    //   }

    //   const application = await Applications.findOne({ appId }).exec();
    //   if (!application) {
    //     throw new NotFoundError(
    //       'Application with matching "appId" does not exist.'
    //     );
    //   }

    //   if (
    //     project.hosting.applications.findIndex(
    //       (id) => id === application._id
    //     ) === -1
    //   ) {
    //     throw new NotFoundError(
    //       'The Project does not contain any application matching the "appId"'
    //     );
    //   }

    //   return application.updateOne({ authenticate: value }).exec();
    // },
    // showAppInAppDrawer: async (_, { projectId, appId, value }, ctx) => {
    //   if (!ctx.userId) {
    //     throw new AuthenticationError('User Not Authenticated');
    //   }
    //   const project = await Projects.findOne({ projectId }).exec();
    //   if (!project) {
    //     throw new NotFoundError(
    //       'Project with matching "projectId" does not exist.'
    //     );
    //   }

    //   const application = await Applications.findOne({ appId }).exec();
    //   if (!application) {
    //     throw new NotFoundError(
    //       'Application with matching "appId" does not exist.'
    //     );
    //   }

    //   if (
    //     project.hosting.applications.findIndex(
    //       (id) => id === application._id
    //     ) === -1
    //   ) {
    //     throw new NotFoundError(
    //       'The Project does not contain any application matching the "appId"'
    //     );
    //   }

    //   return application.updateOne({ showInAppDrawer: value }).exec();
    // },
  },
};

export default ApplicationsResolver;
