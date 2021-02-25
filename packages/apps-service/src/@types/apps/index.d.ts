type App = {
  isActive: boolean
  name: string
  description: string
  path: string
  icon: string
  entityType: App.EntityType
  colorScheme: string
  videoUrl: string
  owner: string
  applicationType: App.Type
  contacts: {
    developers: Array<string>
    qe: Array<string>
    stakeholders: Array<string>
  }
  access: Array<{
    roverGroup: string
    role: App.AccessRole
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
  createdBy: string
  createdOn: Date
  updatedBy: string
  updatedOn: Date
}

namespace App {
  declare const enum EntityType {
    SPA = 'SPA',
    MICROSERVICE = 'MICROSERVICE',
  }
  declare const enum Type {
    BUILTIN = 'BUILTIN',
    HOSTED = 'HOSTED',
  }
  declare const enum AccessRole {
    EDIT = 'EDIT',
    VIEW = 'VIEW',
  }
  declare const enum FeedbackSource {
    JIRA = 'JIRA',
    GITHUB = 'GITHUB',
    GITLAB = 'GITLAB',
    EMAIL = 'EMAIL',
  }
}
