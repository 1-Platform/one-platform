/* Mongoose schema/model definition */
import { Document, Model, model, Schema } from 'mongoose';
import uniqueIdFromPath from '../../utils/unique-id-from-path';

export interface ProjectModel extends Document, Project {}

interface ProjectModelStatic extends Model<ProjectModel> {
  isAuthorized(projectId: any, userId: string): Promise<boolean>;
}

const ProjectSchema = new Schema<ProjectModel, ProjectModelStatic>({
  projectId: {
    type: String,
    unique: true,
    default(): string {
      // referenced as any due to mongoose this typescript issue getting typed from closest object
      return uniqueIdFromPath((this as any).name);
    },
  },
  name: { type: String, required: true },
  description: { type: String },
  tags: { type: [String] },
  icon: { type: String },
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
  contacts: {
    developers: { type: [String] },
    qe: { type: [String] },
    stakeholders: { type: [String] },
  },
  hosting: {
    isEnabled: { type: String },
    applications: [
      {
        _id: false,
        appId: { type: String, required: true, unique: true },
        name: { type: String, required: true, unique: true },
        url: { type: String, required: true, unique: true },
        type: { type: String },
        environments: [
          {
            _id: false,
            name: String,
            version: String,
            url: String,
            createdAt: Date,
          },
        ],
      },
    ],
  },
  feedback: {
    isEnabled: { type: Boolean, default: false },
    sourceType: {
      type: String,
      enum: ['JIRA', 'GITHUB', 'GITLAB', 'EMAIL'],
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

ProjectSchema.index({ name: 1, ownerId: 1 });

ProjectSchema.static(
  'isAuthorized',
  function isAuthorized(projectId: string, userId: string) {
    return this.exists({
      projectId,
      ownerId: userId,
    });
  }
);

const Projects = model<ProjectModel, ProjectModelStatic>(
  'Project',
  ProjectSchema
);

export default Projects;
