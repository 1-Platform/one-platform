declare module '*.graphql';
declare module '*.json';

declare enum Role {
  ADMIN = "ADMIN",
  USER = "USER"
}
type PermissionsType = {
  roverGroup: string;
  role: Role;
};
type HomeUserType = {
  name: string;
  title: string;
  uid: string;
  rhatUUID: string;
  isActive?: boolean;
  memberOf: string[];
  apiRole: string,
  createdBy: string;
  createdOn: Date;
  updatedBy: string;
  updatedOn: Date;
};
type HomeType = {
  name: string;
  description: string;
  link: string;
  icon: string;
  entityType: string;
  colorScheme: string;
  videoUrl: string;
  owners: string[] | HomeUserType[];
  createdBy: string | HomeUserType;
  createdOn: Date;
  updatedBy: string | HomeUserType;
  updatedOn: Date;
  active: boolean;
  permissions: PermissionsType[];
};
