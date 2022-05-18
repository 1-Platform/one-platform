import { Document, Model, model, Schema } from 'mongoose';
import { AnalyticsDoc } from 'db/types';

export const AnalyticsSchema: Schema = new Schema(
  {
    appId: {
      type: String,
      unique: true,
      required: true,
    },
    sentryTeamId: {
      type: String,
      default: process.env.OP_ANALYTICS_SENTRY_TEAM_ID || 'one-platform',
      required: true,
    },
    sentryProjectId: {
      type: String,
      default() {
        return `op-hosted-${(this as any).appId}-spa`;
      },
      unique: true,
      required: true,
    },
    createdBy: { type: String, required: true },
    updatedBy: { type: String, required: true },
  },
  { timestamps: { createdAt: 'createdOn', updatedAt: 'updatedOn' } },
);

export interface AnalyticsModel extends AnalyticsDoc, Document {}

interface AnalyticsModelStatic extends Model<AnalyticsModel> {}

export const Analytics: Model<AnalyticsModel> = model<AnalyticsModel, AnalyticsModelStatic>(
  'Analytics',
  AnalyticsSchema,
);
