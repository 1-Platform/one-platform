export const UserDetailsMock = {
  name: 'Sumeet Ingole',
  email: 'singole@redhat.com',
  title: 'associate software engineer',
  accountType: 'Service Account',
  roverGroups: [
    { name: 'cee-support-case-attachment-access' },
    { name: 'npatil-all' },
    { name: 'one-portal-devel' },
    { name: 'cp-and-devops-india' },
    { name: 'cp-and-devops-pune' },
    { name: 'cp-and-devops-pune' },
    { name: 'npatil-all' },
    { name: 'one-portal-devel' },
  ],
  hostedApps: [
    { name: 'Outage management', link: '#' },
    { name: 'TS Catalog', link: '#' },
    { name: 'DSAL', link: '#' },
    { name: 'OKRs', link: '#' },
    { name: 'Feedback', link: '#' },
  ],
};

export interface IUserAppAuthDetails {
  appName: string;
  authAccess: string;
  permissions: string[];
  owner: { name: string };
}

export const UserAppAuthDetailsMock: IUserAppAuthDetails[] = [
  {
    appName: 'One Platform Home',
    authAccess: 'admin',
    permissions: ['read', 'write'],
    owner: {
      name: 'Deepesh Nair',
    },
  },
  {
    appName: 'Outage Management',
    authAccess: 'admin',
    permissions: ['read', 'write'],
    owner: {
      name: 'Diwahshi Pandey',
    },
  },
  {
    appName: 'TS Catalog',
    authAccess: 'admin',
    permissions: ['read', 'write'],
    owner: {
      name: 'Rigin Oommen',
    },
  },
];
