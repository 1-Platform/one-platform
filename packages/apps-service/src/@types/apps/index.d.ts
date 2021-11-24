/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-redeclare */
type App = {
  appId: string
  isActive: boolean
  name: string
  description: string
  path: string
  icon: string
  entityType: App.EntityType
  colorScheme: string
  videoUrl: string
  ownerId: string
  applicationType: App.Type
  contacts: {
    developers: Array<string>
    qe: Array<string>
    stakeholders: Array<string>
  }
  permissions: Array<{
    name: string
    email: string
    refId: string
    refType: App.PermissionsRefType
    role: App.PermissionsRole
    customRoles?: string[]
  }>
  feedback: {
    isEnabled: boolean
    sourceType: App.FeedbackSource
    sourceApiUrl: string
    sourceHeaders: Array<{
      key: string
      value: string
    }>
    projectKey: string
    feedbackEmail: string
  }
  search: {
    isEnabled: boolean
  }
  notifications: {
    isEnabled: boolean
  }
  database: {
    isEnabled: boolean
    databases: Array<App.Database>
  }
  createdBy: string
  createdOn: Date
  updatedBy: string
  updatedOn: Date
};

namespace App {
  declare const enum EntityType {
    SPA = 'SPA',
    MICROSERVICE = 'MICROSERVICE',
  }
  declare const enum Type {
    BUILTIN = 'BUILTIN',
    HOSTED = 'HOSTED',
  }
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
    name: string
    description?: string
    permissions: Array<DatabasePermissions>
  };
  type DatabasePermissions = {
    admins: Array<string>
    users: Array<string>
  };
}
