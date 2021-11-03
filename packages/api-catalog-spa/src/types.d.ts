interface Window {
  OpAuthHelper: OpAuthHelper;
  OpNotification: OpNotification;
}

interface OpNotification {
  success: (arg0: NotificationArg) => void;
  warning: (arg0: NotificationArg) => void;
  danger: (arg0: NotificationArg) => void;
}

interface NotificationArg {
  subject: string;
  body?: string;
}

interface OpAuthHelper {
  getUserInfo: () => UserDetails;
  jwtToken: string;
  onLogin: (cb: () => void | Promise<void>) => void;
}

interface UserDetails {
  country: string;
  email: string;
  employeeType: string;
  firstName: string;
  fullName: string;
  kerberosID: string;
  lastName: string;
  memberOf: string;
  mobile: undefined;
  preferredTimeZone: string;
  rhatCostCenter: string;
  rhatCostCenterDesc: string;
  rhatGeo: string;
  rhatLocation: string;
  rhatNickname: undefined;
  rhatUUID: string;
  roles: string[];
  title: string;
}
