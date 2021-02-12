import { Document, Model, model, Schema } from 'mongoose';

export const FeedbackSchema: Schema = new Schema( {
    summary: String,
    description: String,
    experience: String,
    config: String,
    ticketUrl: String,
    category: { type: String, enum: [ 'BUG', 'FEEDBACK' ] },
    createdOn: { type: Date, default: Date.now },
    createdBy: String,
    updatedOn: { type: Date, default: Date.now },
    updatedBy: String,
});

interface FeedbackModel extends FeedbackType , Document { }

interface FeedbackModelStatic extends Model <FeedbackModel> { }

export const Feedback: Model<FeedbackModel> = model<FeedbackModel, FeedbackModelStatic>('Feedback', FeedbackSchema);
