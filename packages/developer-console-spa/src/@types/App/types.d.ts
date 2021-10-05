type App = {
  id: string
  appId: string
  name: string
  description: string
  path: string
  database: App.DatabaseConfig
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
declare namespace App {
  declare type DatabaseConfig = {
    isEnabled: boolean
    databases: Database[]
  }
  declare type Database = {
    name: string
    descriptions: string
    permissions: {
      admins: string[]
      users: string[]
    }
  }
  declare type Permission = {
    name: string
    email: string
    refId: string
    refType: 'User' | 'Group'
    role: string
    customRoles: [string]
  }
}

type User = {
  uid: string
  name: string
  email: string
  id: string
}
