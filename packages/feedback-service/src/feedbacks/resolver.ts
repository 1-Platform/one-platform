import * as _ from 'lodash';
import { Feedback } from './schema';
import FeedbackHelper from '../helpers';
import { FeedbackConfig } from '../feedback-config/schema';
import { jiraQueue, gitlabQueue, githubQueue } from '../lib/queue';
import { JIRA_JOB_NAME } from '../jobs/createJira';
import { WorkerProps } from '../jobs';
import { GITHUB_JOB_NAME } from '../jobs/createGithubIssue';
import { GITLAB_JOB_NAME } from '../jobs/createGitlabIssue';

const FeedbackResolver = {
  FeedbackSortType: {
    CREATED_ON: 'createdOn',
    UPDATED_ON: 'updatedOn',
  },
  Query: {
    async listFeedbacks(
      root: any,
      {
        limit = 10,
        offset = 0,
        search,
        category,
        projectId,
        state,
        createdBy,
        ticketUrl,
        stackInfo,
        description,
        module,
        status,
        sort = 'createdOn',
      }: any,
      ctx: any,
    ) {
      // filters
      const match: Record<string, unknown> = {};
      if (search) match.summary = { $regex: search, $options: 'i' };
      if (category) match.category = { $in: category };
      if (createdBy) match.createdBy = createdBy;
      if (state) match.state = state;
      if (ticketUrl) match.ticketUrl = { $regex: ticketUrl, $options: 'i' };
      if (module) match.module = { $regex: module, $options: 'i' };
      if (description) match.description = { $regex: description, $options: 'i' };
      if (stackInfo) match['stackInfo.path'] = { $regex: stackInfo, $options: 'i' };

      if (status) {
        if (status === 'OPEN') {
          match.state = { $ne: 'Closed' };
        } else {
          match.state = 'Closed';
        }
      }

      // multiple application based filter
      if (projectId) {
        const feedbackConfig = await FeedbackConfig.find({
          projectId: { $in: projectId },
        }).exec();
        if (FeedbackConfig) {
          const config = feedbackConfig.map(({ _id }) => _id?.toString());
          match.config = { $in: config };
        } else {
          throw new Error('App not found. Please visit developer-console');
        }
      }

      const paginatedFeedback = await Feedback.aggregate([
        { $match: match },
        { $sort: { [sort]: -1 } },
        {
          $facet: {
            data: [{ $skip: offset }, { $limit: limit }],
            total: [{ $count: 'total' }],
          },
        },
      ]).exec();
      const feedbackRecords = paginatedFeedback[0].data.map((doc: any) => Feedback.hydrate(doc));
      const count = paginatedFeedback[0].total[0]?.total || 0;
      const data = await FeedbackHelper.processFeedbackRecords(feedbackRecords);
      return {
        count,
        data,
      } as PaginatedFeedbackType;
    },
    async getFeedbackById(
      root: any, { id }: any, ctx: any,
    ) {
      const feedbackDoc = await Feedback.findById(id).exec();
      const feedback = await FeedbackHelper.processFeedbackRecords([feedbackDoc]);
      return feedback?.[0];
    },
    async searchFeedbacks(
      root: any,
      {
        limit = 10, offset = 0, searchQuery, sort = 'createdOn',
      }: any,
      ctx: any,
    ) {
      const paginatedFeedback = await Feedback.aggregate([
        {
          $match: {
            $or: [
              { summary: { $regex: searchQuery, $options: 'i' } },
              { ticketUrl: { $regex: searchQuery, $options: 'i' } },
            ],
          },
        },
        { $sort: { [sort]: -1 } },
        {
          $facet: {
            data: [{ $skip: offset }, { $limit: limit }],
            total: [{ $count: 'total' }],
          },
        },
      ]).exec();
      const feedbackRecords = paginatedFeedback[0].data.map((doc: any) => Feedback.hydrate(doc),);
      const count = paginatedFeedback[0].total[0]?.total || 0;
      const data = await FeedbackHelper.processFeedbackRecords(feedbackRecords);
      return {
        count,
        data,
      } as PaginatedFeedbackType;
    },
  },
  Mutation: {
    async createFeedback(root: any, args: any, ctx: any) {
      const userFeedback = args.input;
      let userData: any[] = [];

      if (!userFeedback.createdBy) {
        throw new Error('Field `createdBy` is missing in the request');
      }

      if (typeof userFeedback.createdBy === 'string' && userFeedback.createdBy.startsWith('user:')) {
        const [_, cn] = userFeedback.createdBy.split('/');
        userData = [ {
          cn,
          mail: `${ cn }@redhat.com`,
          uid: cn,
          rhatUUID: userFeedback.createdBy,
        } ];
      } else {
        const userQuery = FeedbackHelper.buildUserQuery([userFeedback.createdBy]);
        userData = await FeedbackHelper.getUserProfiles(userQuery);
      }

      const { projectId } = userFeedback;
      if (!projectId) {
        throw new Error('ProjectId not found. Please visit developer-console');
      }
      const feedbackConfig = await FeedbackConfig.findOne({
        projectId,
      }).exec();
      userFeedback.config = (feedbackConfig as any)?._id;

      if (!feedbackConfig) {
        throw new Error(
          'Feedback configuration not registered. Please visit developer-console',
        );
      }

      userFeedback.state = 'To Do';

      return new Feedback(userFeedback)
        .save()
        .then(async (response: FeedbackType) => {
          /* Create tickets/issues for the respective sourceType */
          if (feedbackConfig?.sourceType === 'GITHUB') {
            await githubQueue.add(GITHUB_JOB_NAME, <WorkerProps>{
              feedbackConfig,
              userFeedback: response,
              app: projectId,
              userData,
            });
          } else if (feedbackConfig?.sourceType === 'JIRA') {
            await jiraQueue.add(JIRA_JOB_NAME, <WorkerProps>{
              feedbackConfig,
              userFeedback,
              app: projectId,
              userData,
            });
          } else if (feedbackConfig?.sourceType === 'GITLAB') {
            await gitlabQueue.add(GITLAB_JOB_NAME, <WorkerProps>{
              feedbackConfig,
              userFeedback,
              app: projectId,
              userData,
            });
          }
          const emailTemplate = FeedbackHelper.createEmailTemplate(
            userData,
            userFeedback,
            projectId,
            feedbackConfig,
          );
          FeedbackHelper.sendEmail(emailTemplate);
          const formattedSearchResponse = FeedbackHelper.formatSearchInput(
            response,
            userData,
          );
          FeedbackHelper.manageSearchIndex(formattedSearchResponse, 'index');
          return response;
        });
    },
    updateFeedback(root: any, { id, input }: any, ctx: any) {
      const userFeedback = input;
      return Feedback.findByIdAndUpdate(id, userFeedback, {
        new: true,
      }).exec();
    },
    async deleteFeedback(root: any, { id }: any, ctx: any) {
      const feedback = await Feedback.findByIdAndRemove(id).exec();
      const input = {
        dataSource: 'oneportal',
        documents: [{ id }],
      };
      FeedbackHelper.manageSearchIndex(input, 'delete');
      if (!feedback) return null;
      return feedback;
    },
    async updateFeedbackIndex(root: any, args: any, ctx: any) {
      const userList: string[] = [];
      await Feedback.find()
        .exec()
        .then(async (feedbacks: FeedbackType[]) => {
          feedbacks.forEach(async (data: FeedbackType) => {
            userList.push(data.createdBy as string, data.updatedBy as string);

            const userData = await Promise.all(
              [data.createdBy, data.updatedBy].map((user) => {
                if (typeof user === 'string' && user.startsWith('user:')) {
                  const [_, cn] = user.split('/');
                  return [
                    {
                      cn,
                      mail: `${cn}@redhat.com`,
                      uid: cn,
                      rhatUUID: user,
                    },
                  ];
                }
                const userQuery = FeedbackHelper.buildUserQuery([user as string]);
                return FeedbackHelper.getUserProfiles(userQuery);
              })
            );
            const formattedSearchResponse = FeedbackHelper.formatSearchInput(
              data,
              userData
            );
            FeedbackHelper.manageSearchIndex(formattedSearchResponse, 'index');
          });
          return feedbacks;
        });
    },
  },
};

export { FeedbackResolver as default };
