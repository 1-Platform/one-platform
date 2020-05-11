import { Document, Model, model, Schema } from 'mongoose';

const FeedbackSchema: Schema = new Schema({
  description: String,
  experience: String,
  ticketID: String,
  spa: String,
  timestamp: {
    createdAt: { type: Date, default: Date.now },
    createdBy: {
      kerberosID: String,
      name: String,
    },
    modifiedAt: Date,
    modifiedBy: {
      kerberosID: String,
      name: String,
    }
  },
  title: String,
  feedbackType: String
});

interface FeedbackModel extends IFeedback , Document { }

interface FeedbackModelStatic extends Model <FeedbackModel> { }

export const Feedback: Model<FeedbackModel> = model<FeedbackModel, FeedbackModelStatic>('Feedback', FeedbackSchema);
