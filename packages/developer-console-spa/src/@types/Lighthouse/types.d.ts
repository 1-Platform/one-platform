declare namespace Lighthouse {
  declare type Config = {
    _id?: string | null,
    appId: string | null,
    branch?: string,
    projectId?: string,
    createdBy?: string;
  }

  declare type Project = {
    name: string,
    id: string,
    adminToken: string,
    token: string;
  }
}
