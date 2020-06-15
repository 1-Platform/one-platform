export const UserDetailsMock = {
  fullName: 'Deepesh Nair',
  email: 'denair@redhat.com',
  employeeType: 'Intern',
  firstName: 'Deepesh',
  lastName: 'Nair',
  title: 'Intern',
  rhatUUID: '81d46410-a234-11e9-97cb-001a4a0a0044',
  kerberosID: 'denair',
  memberOf: 'cn=Intern,ou=userClass,dc=redhat,dc=com',
  preferredTimeZone: 'Asia/Calcutta',
  rhatGeo: 'APAC',
  rhatCostCenter: 654,
  rhatCostCenterDesc: 'R&D DevOps'
};

const getUserDetails = () => {
    try {
      return (window as any).OpAuthHelper?.getUserInfo();
    } catch (err) {
      console.error(err);
    }
  };
export const UserProfile = getUserDetails();
