/* Mongoose schema/model definition */

import { Document, Model, model, Schema } from 'mongoose';
import { Apps } from '.';

export interface AppModel extends Document, App { }

interface AppModelStatic extends Model<AppModel> {
  isAuthorized( id: any, userId: string ): Promise<boolean>;
}

const AppSchema = new Schema<AppModel, AppModelStatic>( {
  isActive: { type: Boolean, default: false, },
  name: { type: String, unique: true, },
  description: { type: String, },
  path: { type: String, required: true, },
  icon: { type: String, },
  entityType: { type: String, },
  colorScheme: { type: String, },
  videoUrl: { type: String, },
  owners: { type: [ String ], },
  applicationType: {
    type: String,
    enum: [ 'BUILTIN', 'HOSTED' ],
    default: App.Type.HOSTED,
    required: true,
  },
  contacts: {
    developers: { type: [ String ], },
    qe: { type: [ String ], },
    stakeholders: { type: [String], },
  },
  access: [ {
    roverGroup: { type: String, },
    role: {
      type: String,
      enum: [ 'EDIT', 'VIEW' ],
      default: App.AccessRole.VIEW,
      required: true,
    },
  } ],
  feedback: {
    isEnabled: { type: Boolean, default: false, },
    sourceType: {
      type: String,
      enum: [ 'JIRA', 'GITHUB', 'GITLAB', 'EMAIL' ],
      default: App.FeedbackSource.EMAIL,
    },
    sourceApiUrl: { type: String, },
    sourceHeaders: [ {
      key: { type: String, },
      value: { type: String, },
    } ],
    projectKey: { type: String, },
    feedbackEmail: { type: String, },
  },
  search: {
    isActive: { type: Boolean, default: false, },
  },
  notifications: {
    isEnabled: { type: Boolean, default: false, },
  },
  createdBy: { type: String, },
  createdOn: { type: Date, default: Date.now, },
  updatedBy: { type: String, },
  updatedOn: { type: Date, default: Date.now },
} );

AppSchema.static( 'isAuthorized', async ( id: any, owner: string ) => {
  const app = await Apps.findById( id ).exec();
  return app && owner && app.owner === owner;
} );

export default model<AppModel, AppModelStatic>( 'App', AppSchema );
