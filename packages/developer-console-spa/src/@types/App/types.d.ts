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
  declare type Permission = {
    name: string
    email: string
    refId: string
    refType: 'User' | 'Group'
    role: string
    customRoles: [string]
  }
}
