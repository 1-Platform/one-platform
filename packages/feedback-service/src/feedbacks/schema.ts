import {
  Document, Model, model, Schema,
} from 'mongoose';

export const FeedbackSchema: Schema = new Schema({
  summary: String,
  description: String,
  experience: String,
  state: String,
  error: String,
  config: String,
  ticketUrl: String,
  stackInfo: {
    stack: { type: String },
    path: { type: String },
  },
  category: { type: String, enum: ['BUG', 'FEEDBACK'] },
  createdBy: String,
  updatedBy: String,
}, { timestamps: { createdAt: 'createdOn', updatedAt: 'updatedOn' } });

export interface FeedbackModel extends FeedbackType, Document { }

interface FeedbackModelStatic extends Model <FeedbackModel> { }

export const Feedback: Model<FeedbackModel> = model<FeedbackModel, FeedbackModelStatic>('Feedback', FeedbackSchema);
