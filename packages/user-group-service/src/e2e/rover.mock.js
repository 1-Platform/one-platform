export const roverUser = {
  result: [
    {
      cn: 'Alexander the Great',
      uid: 'alexanderthegreat',
      name: 'Alexander the Great',
      rhatJobTitle: 'Senior Fighter',
      rhatUuid: '1234567890',
      manager: 'uid=spiderman,ou=users,dc=redhat,dc=com',
      _id: '5b102ee74569b48d96825ec5',
    },
  ],
};

export const roverManager = {
  result: [
    {
      cn: 'Alexander the Great',
      uid: 'spiderman',
      rhatJobTitle: 'Senior Manager',
      rhatUuid: '1134367890',
      _id: '5b102ee74569b48d96825ec6',
    },
  ],
};

export const roverGroup = {
  result: {
    cn: 'test-group',
    name: 'The Test Group',
    description: 'The Test Group',
    memberUids: ['uid=alexanderthegreat'],
  },
};
