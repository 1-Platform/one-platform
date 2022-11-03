type Project = {
  id: string
  projectId: string
  name: string
  description: string
  path: string
  database: Project.DatabaseConfig
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
declare namespace Project {
  declare type Permission = {
    name: string
    email: string
    refId: string
    refType: 'User' | 'Group'
    role: string
    customRoles: [string]
  }
}
