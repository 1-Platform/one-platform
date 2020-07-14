import { Document, Model, model, Schema } from 'mongoose';

const FeedbackSchema: Schema = new Schema({
  description: String,
  experience: String,
  ticketID: String,
  spa: String,
  createdOn: { type: Date, default: Date.now },
  createdBy: {type: String, required: true},
  updatedOn: { type: Date, default: Date.now },
  updatedBy: String,
  title: String,
  feedbackType: String
});

interface FeedbackModel extends IFeedback , Document { }

interface FeedbackModelStatic extends Model <FeedbackModel> { }

export const Feedback: Model<FeedbackModel> = model<FeedbackModel, FeedbackModelStatic>('Feedback', FeedbackSchema);
