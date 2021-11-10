/* Mongoose schema/model definition */

import {
  Document, Model, model, Schema,
} from 'mongoose';
import uniqueIdFromPath from '../../utils/unique-id-from-path';

export interface AppModel extends Document, App {}

interface AppModelStatic extends Model<AppModel> {
  isAuthorized(appId: any, userId: string): Promise<boolean>;
}

const AppSchema = new Schema<AppModel, AppModelStatic>({
  appId: {
    type: String,
    unique: true,
    default(this: App) {
      return uniqueIdFromPath(this.path) || uniqueIdFromPath(this.name);
    },
  },
  isActive: { type: Boolean, default: false },
  name: { type: String, unique: true },
  description: { type: String },
  path: { type: String },
  icon: { type: String },
  colorScheme: { type: String },
  videoUrl: { type: String },
  ownerId: { type: String },
  permissions: [
    {
      name: { type: String, required: true },
      email: { type: String },
      refId: { type: String, required: true },
      refType: {
        type: String,
        enum: ['User', 'Group'],
        default: 'User',
        required: true,
      },
      role: {
        type: String,
        enum: ['Editor', 'Viewer'],
        default: 'Viewer',
        required: true,
      },
      customRoles: { type: [String] },
    },
  ],
  applicationType: {
    type: String,
    enum: ['BUILTIN', 'HOSTED'],
    default: App.Type.HOSTED,
    required: true,
  },
  contacts: {
    developers: { type: [String] },
    qe: { type: [String] },
    stakeholders: { type: [String] },
  },
  hosting: {
    isEnabled: { type: String },
    path: { type: String },
    refId: { type: String },
  },
  feedback: {
    isEnabled: { type: Boolean, default: false },
    sourceType: {
      type: String,
      enum: ['JIRA', 'GITHUB', 'GITLAB', 'EMAIL'],
      default: App.FeedbackSource.EMAIL,
    },
    sourceApiUrl: { type: String },
    sourceHeaders: [
      {
        key: { type: String },
        value: { type: String },
      },
    ],
    projectKey: { type: String },
    feedbackEmail: { type: String },
  },
  search: {
    isEnabled: { type: Boolean, default: false },
  },
  notifications: {
    isEnabled: { type: Boolean, default: false },
  },
  database: {
    isEnabled: { type: Boolean, default: false },
    databases: [
      {
        name: { type: String, required: true },
        description: { type: String },
        permissions: { admins: [String], users: [String] },
      },
    ],
  },
  lighthouse: {
    isEnabled: { type: Boolean, default: false },
    projectId: { type: String },
    branch: { type: String },
  },
  createdBy: { type: String },
  createdOn: { type: Date, default: Date.now },
  updatedBy: { type: String },
  updatedOn: { type: Date, default: Date.now },
});

AppSchema.static('isAuthorized', function isAuthorized(appId: any, userId: string) {
  return this.exists({
    _id: appId, ownerId: userId,
  });
});

const Apps = model<AppModel, AppModelStatic>('App', AppSchema);

export { Apps as default };
