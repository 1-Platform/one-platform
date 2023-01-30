import {
  Document, Model, model, Schema,
} from 'mongoose';

export const FeedbackConfigSchema: Schema = new Schema({
  appId: {
    type: String,
    required: false,
    unique: true,
  },
  projectId: {
    type: String,
    required: true,
    unique: true,
  },
  isEnabled: { type: Boolean, default: true },
  sourceType: { type: String, enum: ['JIRA', 'GITLAB', 'GITHUB', 'EMAIL'], default: 'JIRA' },
  sourceApiUrl: { type: String },
  sourceHeaders: [
    {
      key: { type: String },
      value: { type: String },
    },
  ],
  projectKey: { type: String, default: 'ONEPLAT' },
  feedbackEmail: {
    type: String,
    default: 'one-portal-devel+feedback@redhat.com',
  },
});

interface FeedbackConfigModel extends FeedbackConfigType, Document { }

interface FeedbackConfigModelStatic extends Model <FeedbackConfigModel> { }

export const FeedbackConfig: Model<FeedbackConfigModel> = model<FeedbackConfigModel, FeedbackConfigModelStatic>('FeedbackConfig', FeedbackConfigSchema);
