declare type Project = {
  projectId: string;
  name: string;
  description: string;
  path: string;
  icon: string;
  colorScheme: string;
  videoUrl: string;
  ownerId: string;
  contacts: {
    developers: Array<string>;
    qe: Array<string>;
    stakeholders: Array<string>;
  };
  permissions: Array<{
    name: string;
    email: string;
    refId: string;
    refType: Project.PermissionsRefType;
    role: Project.PermissionsRole;
    customRoles?: string[];
  }>;
  hosting: {
    isEnabled: boolean;
    applications: Project.Application[];
  };
  feedback: {
    isEnabled: boolean;
    sourceType: Project.FeedbackSource;
    sourceApiUrl: string;
    sourceHeaders: Array<{
      key: string;
      value: string;
    }>;
    projectKey: string;
    feedbackEmail: string;
  };
  search: {
    isEnabled: boolean;
  };
  notifications: {
    isEnabled: boolean;
  };
  database: {
    isEnabled: boolean;
    databases: Array<Project.Database>;
  };
  createdBy: string;
  createdOn: Date;
  updatedBy: string;
  updatedOn: Date;
};

namespace Project {
  declare const enum PermissionsRole {
    EDIT = 'EDIT',
    VIEW = 'VIEW',
  }
  declare const enum PermissionsRefType {
    USER = 'User',
    GROUP = 'Group',
  }
  declare const enum FeedbackSource {
    JIRA = 'JIRA',
    GITHUB = 'GITHUB',
    GITLAB = 'GITLAB',
    EMAIL = 'EMAIL',
  }
  type Database = {
    name: string;
    description?: string;
    permissions: Array<DatabasePermissions>;
  };
  type DatabasePermissions = {
    admins: Array<string>;
    users: Array<string>;
  };
  type Application = {
    appId: string;
    name: string;
    url: string;
    type: string;
    environments: [{ name: string; version: string; url: string; createdAt: Date }];
  };
}
