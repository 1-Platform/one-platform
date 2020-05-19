declare module '*.graphql';
declare module '*.json';

// define your types here

type LdapType = {
  dn?: string;
  controls?: string[];
  memberOf?: string[];
  rhatContactMethod?: string;
  roomNumber?: string;
  rhatOfficeFloor?: string;
  rhatOfficeLocation?: string;
  registeredAddress?: string;
  street?: string;
  physicalDeliveryOfficeName?: string;
  postalCode?: number;
  rhatCostCenterDesc?: string;
  rhatUUID?: string;
  uidNumber?: number;
  rhatJobTitle?: string;
  employeeType?: string;
  rhatAdjSvcDate?: string;
  co?: string;
  rhatAmbassadorED?: string;
  l?: string;
  cn?: string;
  mobile?: string;
  manager?: string;
  c?: string;
  homeDirectory?: string;
  rhatOraclePersonID?: number;
  loginShell?: string;
  st?: string;
  rhatTeamLead?: boolean;
  sn?: string;
  rhatSupervisorID?: number;
  uid?: string;
  title?: string;
  rhatPersonType?: string;
  rhatNickName?: string;
  displayName?: string;
  telephoneNumber?: number;
  gidNumber?: number;
  rhatPhoneExt?: number;
  rhatLocation?: string;
  rhatCostCenter?: number;
  givenName?: string;
  rhatGeo?: string;
  preferredTimeZone?: string;
  rhatHireDate?: string;
  rhatCurrency?: string;
  rhatPrimaryMail?: string;
  employeeNumber?: number;
  rhatWorkHours?: string;
  mail?: string;
  rhatOriginalHireDate?: string;
  rhatLegalEntity?: string;
  rhatJobCode?: number;
  rhatBJNMeetingID?: number;
  rhatSocialURL?: string[];
  rhatJobRole?: string;
  rhatBJNUserName?: string;
  objectClass?: string[];
}

type IUser = {
  uid: string;
  name: string;
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
