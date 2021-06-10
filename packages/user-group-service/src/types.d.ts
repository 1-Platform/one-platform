declare module '*.graphql';
declare module '*.json';

// define your types here

type User = {
  _id?: any;
  uid: string;
  cn: string;
  rhatJobTitle: string;
  rhatCostCenter: string;
  rhatCostCenterDesc: string;
  rhatGeo: string;
  givenName: string;
  displayName: string;
  employeeType: string;
  rhatLocation: string;
  rhatOfficeLocation: string;
  mobile: string;
  mail: string;
  country: string;
  homePhone: string;
  telephoneNumber: string;
  rhatPhoneExt: string;
  objectClass: string;
  rhatUuid: string;
  serviceAccount: boolean;
  isActive ?: boolean;
  createdOn: Date;
  updatedOn: Date;
}

type Group = {
  _id?: any;
  name: string;
  cn: string;
  createdOn: Date;
  updatedOn: Date;
}

type APIKey = {
  _id?: any;
  accessToken: string;
  shortKey: string;
  hashKey: string;
  expiresOn: Date;
  owner: string;
  ownerType: string;
  access: [ {
    role: string;
    microservice: string;
  } ];
  createdOn: Date;
  createdBy: string;
  updatedOn: Date;
  updatedBy: string;
}
declare enum OwnerType {
  User = 'User',
  Group = 'Group'
}

type GraphQLArgs = {
  payload: Group,
  selector: Group,
  limit: number,
  [ x: string ]: any,
};
