export type UserInfoFn = (userInfo: UserInfo | null) => void;

export type UserInfo = {
  fullName: string;
  email: string;
  employeeType: string;
  firstName: string;
  lastName: string;
  title: string;
  rhatUUID: string;
  kerberosID: string;
  memberOf: string;
  rhatLocation: string;
  preferredTimeZone: string;
  preferred_username: string;
  rhatNickname: string;
  rhatGeo: string;
  rhatCostCenter: string;
  rhatCostCenterDesc: string;
  mobile: string;
  country: string;
  role: string[];
};

export type Token = {
  cn: string;
  email: string;
  employeeType: string;
  firstName: string;
  lastName: string;
  title: string;
  rhatUUID: string;
  uid: string;
  memberOf: string;
  rhatLocation: string;
  preferredTimeZone: string;
  preferred_username: string;
  rhatNickName: string;
  rhatGeo: string;
  rhatCostCenter: string;
  rhatCostCenterDesc: string;
  mobile: string;
  c: string;
  role: string[];
};

export enum LocalStorageCreds {
  LoginToken = "opc-login-token",
  RefreshToken = "opc-refresh-token",
}
