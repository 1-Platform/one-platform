import {
  Document, Model, model, Schema,
} from 'mongoose';

export const FeedbackConfigSchema: Schema = new Schema({
  appId: { type: String },
  isEnabled: { type: Boolean, default: true },
  sourceType: { type: String, enum: ['JIRA', 'GITLAB', 'GITHUB', 'EMAIL'] },
  sourceApiUrl: { type: String },
  sourceHeaders: [
    {
      key: { type: String },
      value: { type: String },
    },
  ],
  projectKey: { type: String, default: 'ONEPLAT' },
  feedbackEmail: { type: String, default: 'one-portal-devel+feedback@redhat.com' },
});

interface FeedbackConfigModel extends FeedbackConfigType, Document { }

interface FeedbackConfigModelStatic extends Model <FeedbackConfigModel> { }

export const FeedbackConfig: Model<FeedbackConfigModel> = model<FeedbackConfigModel, FeedbackConfigModelStatic>('FeedbackConfig', FeedbackConfigSchema);
