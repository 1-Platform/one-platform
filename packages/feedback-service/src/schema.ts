import { Document, Model, model, Schema } from 'mongoose';
import { IFeedback } from "./types";

export const FeedbackSchema: Schema = new Schema({
  description: String,
  experience: String,
  iid: String,
  spa: String,                
  portalFeedback: Boolean,
  timestamp: {
    createdAt: { type: Date, default: Date.now },
    createdBy: {
      kerberosID: String,
      name: String,
      email: String
    },
    modifiedAt: Date,
    modifiedBy: {
      kerberosID: String,
      name: String,
      email: String
    }
  },
  title: String,
  feedbackType: String
});

interface FeedbackModel extends IFeedback , Document { }

interface FeedbackModelStatic extends Model <FeedbackModel> { }

export const Feedback: Model<FeedbackModel> = model<FeedbackModel, FeedbackModelStatic>('Feedback', FeedbackSchema);
