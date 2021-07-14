/* Mongoose schema/model definition */

import { Document, Model, model, Schema } from 'mongoose';
import { Apps } from '.';
import uniqueIdFromPath from '../../utils/unique-id-from-path';

export interface AppModel extends Document, App { }

interface AppModelStatic extends Model<AppModel> {
  isAuthorized( appId: any, userId: string ): Promise<boolean>;
}

const AppSchema = new Schema<AppModel, AppModelStatic>( {
  appId: {
    type: String,
    unique: true,
    default: function ( this: App ) { return uniqueIdFromPath( this.path ) || uniqueIdFromPath( this.name ); },
  },
  isActive: { type: Boolean, default: false, },
  name: { type: String, unique: true, },
  description: { type: String, },
  path: { type: String, required: true, },
  icon: { type: String, },
  colorScheme: { type: String, },
  videoUrl: { type: String, },
  ownerId: { type: String, },
  permissions: [ {
    refId: { type: String, },
    refType: { type: String, enum: [ 'User', 'Group' ] },
    role: { type: String, required: true, },
  } ],
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
    isEnabled: { type: Boolean, default: false, },
  },
  notifications: {
    isEnabled: { type: Boolean, default: false, },
  },
  database: {
    isEnabled: { type: Boolean, default: false, },
  },
  lighthouse: {
    isEnabled: { type: Boolean, default: false, },
    projectId: { type: String, },
    branch: { type: String, },
  },
  createdBy: { type: String, },
  createdOn: { type: Date, default: Date.now, },
  updatedBy: { type: String, },
  updatedOn: { type: Date, default: Date.now },
} );

AppSchema.static( 'isAuthorized', ( appId: any, userId: string ) => {
  return Apps.exists( { _id: appId, ownerId: userId } );
} );

export default model<AppModel, AppModelStatic>( 'App', AppSchema );
