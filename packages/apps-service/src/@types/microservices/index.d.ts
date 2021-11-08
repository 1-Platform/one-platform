/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-redeclare */
type Microservice = {
  serviceId: string
  name: string
  description: string
  isActive: boolean
  docsUrl: string
  ownerId: string
  permissions: [Microservice.Permissions]
  serviceType: Microservice.Type
  createdBy: string
  createdOn: Date
  updatedBy: string
  updatedOn: Date
};

namespace Microservice {
  type Permissions = {
    refId: string
    refType: PermissionsRefTypeEnum
    role: string
  };
  declare const enum PermissionsRefTypeEnum {
    User = 'User',
    Group = 'Group',
  }
  declare const enum Type {
    BUILTIN = 'BUILTIN',
    HOSTED = 'HOSTED',
  }
}
