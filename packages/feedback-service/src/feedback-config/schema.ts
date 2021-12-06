import {
  Document, Model, model, Schema,
} from 'mongoose';

export const FeedbackConfigSchema: Schema = new Schema({
  appId: { type: String },
  isEnabled: { type: Boolean, default: false },
  sourceType: { type: String, enum: ['JIRA', 'GITLAB', 'GITHUB', 'EMAIL'] },
  sourceApiUrl: { type: String },
  sourceHeaders: [
    {
      key: { type: String },
      value: { type: String },
    },
  ],
  projectKey: { type: String },
  feedbackEmail: { type: String },
});

interface FeedbackConfigModel extends FeedbackConfigType, Document { }

interface FeedbackConfigModelStatic extends Model <FeedbackConfigModel> { }

export const FeedbackConfig: Model<FeedbackConfigModel> = model<FeedbackConfigModel, FeedbackConfigModelStatic>('FeedbackConfig', FeedbackConfigSchema);
