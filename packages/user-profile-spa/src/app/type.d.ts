
declare enum Role {
  ADMIN = "ADMIN",
  USER = "USER"
}
type PermissionsType = {
  roverGroup: string;
  role: Role;
}
type UserType = {
  name: string;
  title: string;
  uid: string;
  rhatUUID: string;
  isActive ?: boolean;
  memberOf: string[];
  apiRole: string,
  createdBy: string;
  createdOn: Date;
  updatedBy: string;
  updatedOn: Date;
}
type HomeType = {
  name: string;
  description: string;
  link: string;
  icon: string;
  entityType: string;
  colorScheme: string;
  videoUrl: string;
  owners: string[] | UserType[];
  createdBy: string  | UserType;
  createdOn: Date;
  updatedBy: string | UserType;
  updatedOn: Date;
  active: boolean;
  permissions: PermissionsType[];
}
