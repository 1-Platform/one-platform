export const UserDetails = {
  _id: '5eccdcaf311cdc5c8dbee000',
  name: 'Deepesh Nair',
  rhatUUID: '81d46410-a234-11e9-97cb-001a4a0a0044',
  memberOf: [
    'Employee',
    'paas-open-platform-users',
    'opendcim',
    'cee-support-case-attachment-access',
    'one-portal-devel',
    'cp-and-devops-india',
    'cp-and-devops-pune',
    'jmoran-all',
    'pnt-dr-authors',
    'exd-all',
    'dxp-all',
    'exd-pune',
    'exd-dxp-all',
    'exd-dxp-pune',
    'exd-infra-ma-dsal'
  ],
  uid: 'denair',
  apiRole: 'ADMIN',
  title: 'Associate Software Engineer',
};


const getUserDetails = () => {
    try {
      return (window as any).OpAuthHelper?.getUserInfo();
    } catch (err) {
      console.error(err);
    }
  };
export const UserProfile = getUserDetails();
