import { useState } from 'react';

export default function useHosting() {
  const [hosting] = useState({
    isEnabled: true,
    applications: [
      {
        name: 'user-groups',
        path: '/user-groups',
        showInAppDrawer: false,
        authenticate: false,
        icon: null,
        environments: [
          {
            name: 'dev',
            ref: 'sdfs32',
            url: 'https://dev.one.redhat.com/user-groups',
            createdAt: '2022-07-05T06:36:27.607Z',
          },
          {
            name: 'qa',
            ref: 'v1.1.0-alpha',
            url: 'https://dev.one.redhat.com/user-groups',
            createdAt: '2022-07-05T06:36:27.607Z',
          },
          {
            name: 'stage',
            ref: 'v1.0.0-rc',
            url: 'https://dev.one.redhat.com/user-groups',
            createdAt: '2022-07-05T06:36:27.607Z',
          },
          {
            name: 'prod',
            ref: 'v1.0.0',
            url: 'https://dev.one.redhat.com/user-groups',
            createdAt: '2022-07-05T06:36:27.607Z',
          },
        ],
      },
    ],
  });

  return { hosting };
}
