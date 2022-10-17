import { Document, Model, model, Schema } from 'mongoose';
import { AnalyticsDoc } from 'db/types';

export const AnalyticsSchema: Schema = new Schema(
  {
    appId: {
      type: String,
      unique: true,
      required: true,
    },
    sentryProjectId: {
      type: String,
      index: { unique: true, sparse: true },
    },
    sentryTeamId: {
      type: String,
    },
    matomoSiteId: {
      type: String,
      index: { unique: true, sparse: true },
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
