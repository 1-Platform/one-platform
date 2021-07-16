/* GraphQL Schema Definition */

export default /* GraphQL */`
type Query {
  services: [Service]
  myServices: [Service]
  findServices(selectors: FindServicesInput!): [Service]
  service(id: ID, serviceId: String): Service
}

type Mutation {
  createService(service: CreateServiceInput!): Service
  updateService(id: ID!, service: UpdateServiceInput!): Service
  deleteService(id: ID!): Service
}

type Service {
  id: ID
  serviceId: String
  name: String
  description: String
  isActive: Boolean
  docsUrl: String
  ownerId: String
  permissions: [AppPermissions]
  serviceType: ServiceType
  createdBy: String
  createdOn: ISODate
  updatedBy: String
  updatedOn: ISODate
}
type AppPermissions {
  refId: String
  refType: AppPermissionRefType
  role: String
}

input FindServicesInput {
  id: ID
  serviceId: String
  name: String
  isActive: Boolean
  ownerId: String
  serviceType: ServiceType
}
input CreateServiceInput {
  name: String!
  description: String!
  isActive: Boolean
  docsUrl: String
  permissions: [AppPermissionsInput]
  serviceType: ServiceType!
}
input UpdateServiceInput {
  name: String
  description: String
  isActive: Boolean
  docsUrl: String
  ownerId: String
  permissions: [AppPermissionsInput]
  serviceType: ServiceType
}
input AppPermissionsInput {
  refId: String
  refType: AppPermissionRefType
  role: String
}

enum ServiceType {
  BUILTIN
  HOSTED
}
enum AppPermissionRefType {
  User
  Group
}
`;
