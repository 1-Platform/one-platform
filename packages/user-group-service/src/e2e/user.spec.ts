/* Mock */
import supertest from 'supertest';
import UserGroup from '../../service';
import { UserGroupAPIHelper } from '../helpers';
import { roverGroup, roverManager, roverUser } from './rover.mock';
import { group as mockGroup, user as mockUser } from './mock';

/* Supertest */

let request: supertest.SuperTest<supertest.Test>;
const query = `
  fragment userType on UserType {
      _id
      uid
      name
      rhatUUID
      title
  }

  fragment roverUserType on RoverUserType {
      cn
      uid
      name
      rhatJobTitle
      rhatUUID
      title
  }

  fragment group on Group {
      _id
      cn
      name
      createdOn
      updatedOn
  }
  query ListGroups($limit: Int) {
    listGroups(limit: $limit) {
      ...group
    }
  }
  query GetGroupsBy($selector: GetGroupInput!, $limit: Int) {
    getGroupsBy( selector: $selector, limit: $limit ) {
      ...group
    }
  }
  query Group($cn: String!) {
    group( cn: $cn ) {
      cn
      name
      members{
        cn
        name
        uid
      }
    }
  }

  mutation AddingGroup($payload: AddGroupInput!) {
      addGroup(payload: $payload) {
        ...group
      }
  }

  mutation UpdatingGroup($id: ID!, $payload: UpdateGroupInput!) {
      updateGroup(id: $id, payload: $payload) {
        ...group
      }
  }

  mutation DeletingGroup($id: ID!) {
      deleteGroup(id: $id) {
        ...group
      }
  }

  query ListUsers {
    listUsers {
        ...userType
    }
  }

  query SearchingRoverUsers( $ldapfield: ldapFieldType, $value: String, $cacheUser: Boolean ) {
      searchRoverUsers(ldapfield: $ldapfield, value: $value, cacheUser: $cacheUser) {
          ...roverUserType
      }
  }

  mutation AddingUser($input: UserInput) {
      addUser(input: $input) {
          ...userType
      }
  }

  query GetUsersBy($uid: String) {
    getUsersBy(uid: $uid) {
      _id
      uid
      name
      manager{
        cn
        name
      }
    }
  }

  mutation UpdatingUser($input: UserInput) {
      updateUser(input: $input) {
          ...userType
      }
  }

  mutation DeletingUser($_id: String!) {
      deleteUser(_id: $_id) {
          ...userType
      }
  }

  mutation AddingUserFromRover($uid: String!) {
      addUserFromRover(uid: $uid) {
          ...userType
      }
  }
`;

beforeAll(() => {
  request = supertest.agent(UserGroup);
});
afterAll(() => UserGroup.close());

describe('User-Group Microservice API Test', () => {
  let tempGroupId = '';

  it('should add user from rover', (done) => {
    const roverFetchSpy = jest
      .spyOn(UserGroupAPIHelper, 'roverFetch')
      .mockImplementation(() => Promise.resolve(roverUser));
    request
      .post('/graphql')
      .send({
        query,
        operationName: 'AddingUserFromRover',
        variables: {
          uid: mockUser.uid,
        },
      })
      .expect((res) => {
        const user = roverUser.result[0];
        expect(res.body).not.toHaveProperty('errors');
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('addUserFromRover');
        expect(res.body.data.addUserFromRover).toHaveProperty(
          'name',
          user.name
        );
        expect(res.body.data.addUserFromRover).toHaveProperty('uid', user.uid);
        expect(roverFetchSpy).toHaveBeenCalledTimes(1);

        // Delete the user added to the cache for other tests to run
        request
          .post('/graphql')
          .send({
            query,
            operationName: 'DeletingUser',
            variables: {
              _id: user._id,
            },
          })
          .expect((res) => {
            expect(res.body).not.toHaveProperty('errors');
            expect(res.body).toHaveProperty('data');
            expect(res.body.data).toHaveProperty('deleteUser');
            expect(res.body.data.deleteUser).toHaveProperty('_id', user._id);
            expect(res.body.data.deleteUser).toHaveProperty('uid', user.uid);
            expect(res.body.data.deleteUser).toHaveProperty('name', user.name);
          })
          .end((err) => {
            done(err);
          });
      })
      .end((err) => {
        done(err);
        roverFetchSpy.mockRestore();
      });
  });

  it('should search users from rover', (done) => {
    const roverFetchSpy = jest
      .spyOn(UserGroupAPIHelper, 'roverFetch')
      .mockImplementation(() => Promise.resolve(roverUser));
    request
      .post('/graphql')
      .send({
        query,
        operationName: 'SearchingRoverUsers',
        variables: {
          ldapfield: 'uid',
          value: 'alexanderthegreat',
          cacheUser: false,
        },
      })
      .expect((res) => {
        const user = roverUser.result[0];
        const userSearched = res.body.data.searchRoverUsers[0];
        expect(res.body).not.toHaveProperty('errors');
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('searchRoverUsers');
        expect(userSearched).toHaveProperty('name', user.name);
        expect(userSearched).toHaveProperty('uid', user.uid);
        expect(userSearched).toHaveProperty('rhatJobTitle', user.rhatJobTitle);
        expect(roverFetchSpy.mock.calls.length).toBe(1);
      })
      .end((err) => {
        done(err);
        roverFetchSpy.mockRestore();
      });
  });

  it('should create a new User', (done) => {
    request
      .post('/graphql')
      .send({
        query,
        operationName: 'AddingUser',
        variables: {
          input: mockUser,
        },
      })
      .expect((res) => {
        expect(res.body).not.toHaveProperty('errors');
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('addUser');
        expect(res.body.data.addUser).toHaveProperty('_id', mockUser._id);
        expect(res.body.data.addUser).toHaveProperty('uid', mockUser.uid);
        expect(res.body.data.addUser).toHaveProperty('name', mockUser.name);
      })
      .end((err) => {
        done(err);
      });
  });

  it('should get Users by uid', (done) => {
    const roverFetchSpy = jest
      .spyOn(UserGroupAPIHelper, 'roverFetch')
      .mockImplementation(() => Promise.resolve(roverManager.result[0]));
    request
      .post('/graphql')
      .send({
        query,
        operationName: 'GetUsersBy',
        variables: {
          uid: mockUser.uid,
        },
      })
      .expect((res) => {
        expect(res.body).not.toHaveProperty('errors');
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('getUsersBy');
        expect(res.body.data.getUsersBy).not.toHaveLength(0);
        expect(res.body.data.getUsersBy[0]).toHaveProperty('_id');
        expect(res.body.data.getUsersBy[0]).toHaveProperty('uid');
        expect(res.body.data.getUsersBy[0].manager).toEqual(
          expect.objectContaining({ cn: roverManager.result[0].cn })
        );
        expect(res.body.data.getUsersBy).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              _id: mockUser._id,
              uid: mockUser.uid,
              name: mockUser.name,
            }),
          ])
        );
      })
      .end((err) => {
        done(err);
        roverFetchSpy.mockRestore();
      });
  });

  it('should list all Users', (done) => {
    request
      .post('/graphql')
      .send({
        query,
        operationName: 'ListUsers',
        variables: {
          uid: mockUser.uid,
        },
      })
      .expect((res) => {
        expect(res.body).not.toHaveProperty('errors');
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('listUsers');
        expect(res.body.data.listUsers).not.toHaveLength(0);
        expect(res.body.data.listUsers[0]).toHaveProperty('_id');
        expect(res.body.data.listUsers[0]).toHaveProperty('uid');
        expect(res.body.data.listUsers[0]).toHaveProperty('name');
      })
      .end((err) => {
        done(err);
      });
  });

  it('should update the User', (done) => {
    request
      .post('/graphql')
      .send({
        query,
        operationName: 'UpdatingUser',
        variables: {
          input: mockUser,
        },
      })
      .expect((res) => {
        expect(res.body).not.toHaveProperty('errors');
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('updateUser');
        expect(res.body.data.updateUser).toHaveProperty('_id', mockUser._id);
        expect(res.body.data.updateUser).toHaveProperty('uid', mockUser.uid);
        expect(res.body.data.updateUser).toHaveProperty('name', mockUser.name);
      })
      .end((err) => {
        done(err);
      });
  });

  it('should create a new user group', (done) => {
    const manageSearchSpy = jest
      .spyOn(UserGroupAPIHelper, 'manageSearchIndex')
      .mockReturnValueOnce(Promise.resolve());
    request
      .post('/graphql')
      .send({
        query,
        operationName: 'AddingGroup',
        variables: {
          payload: {
            cn: mockGroup.cn,
            name: mockGroup.name,
          },
        },
      })
      .expect((res) => {
        expect(res.body).not.toHaveProperty('errors');
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('addGroup');
        expect(res.body.data.addGroup).toHaveProperty('_id');
        tempGroupId = res.body.data.addGroup._id;
        expect(res.body.data.addGroup).toHaveProperty('cn', mockGroup.cn);
        expect(res.body.data.addGroup).toHaveProperty('name', mockGroup.name);
      })
      .end((err) => {
        done(err);
        manageSearchSpy.mockRestore();
      });
  });

  it('should update user groups', (done) => {
    const manageSearchSpy = jest
      .spyOn(UserGroupAPIHelper, 'manageSearchIndex')
      .mockReturnValueOnce(Promise.resolve());
    request
      .post('/graphql')
      .send({
        query,
        operationName: 'UpdatingGroup',
        variables: {
          id: tempGroupId,
          payload: {
            cn: mockGroup.cn,
            name: mockGroup.name,
          },
        },
      })
      .expect((res) => {
        expect(manageSearchSpy.mock.calls.length).toBe(1);
        expect(res.body).not.toHaveProperty('errors');
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('updateGroup');
        expect(res.body.data.updateGroup).toHaveProperty('_id', tempGroupId);
        expect(res.body.data.updateGroup).toHaveProperty('cn', mockGroup.cn);
        expect(res.body.data.updateGroup).toHaveProperty(
          'name',
          mockGroup.name
        );
      })
      .end((err) => {
        done(err);
        manageSearchSpy.mockRestore();
      });
  });
  it('should get user group', (done) => {
    const roverFetchSpy = jest
      .spyOn(UserGroupAPIHelper, 'roverFetch')
      .mockImplementation(() => Promise.resolve(roverGroup));
    request
      .post('/graphql')
      .send({
        query,
        operationName: 'Group',
        variables: {
          cn: mockGroup.cn,
        },
      })
      .expect((res) => {
        expect(res.body).not.toHaveProperty('errors');
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('group');
        expect(res.body.data.group).toHaveProperty('cn', mockGroup.cn);
        expect(res.body.data.group).toHaveProperty('name', mockGroup.name);
        expect(res.body.data.group.members).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ uid: mockUser.uid }),
          ])
        );
      })
      .end((err) => {
        done(err);
        roverFetchSpy.mockRestore();
      });
  });
  it('should get user groups by selector', (done) => {
    request
      .post('/graphql')
      .send({
        query,
        operationName: 'GetGroupsBy',
        variables: {
          selector: {
            cn: mockGroup.cn,
          },
        },
      })
      .expect((res) => {
        expect(res.body).not.toHaveProperty('errors');
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('getGroupsBy');
        expect(res.body.data.getGroupsBy).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ cn: mockGroup.cn }),
          ])
        );
      })
      .end((err) => {
        done(err);
      });
  });

  it('should list all user groups', (done) => {
    request
      .post('/graphql')
      .send({
        query,
        operationName: 'ListGroups',
      })
      .expect((res) => {
        expect(res.body).not.toHaveProperty('errors');
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('listGroups');
        expect(res.body.data.listGroups).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ cn: mockGroup.cn }),
          ])
        );
      })
      .end((err) => {
        done(err);
      });
  });

  it('should delete the user', (done) => {
    request
      .post('/graphql')
      .send({
        query,
        operationName: 'DeletingUser',
        variables: {
          _id: mockUser._id,
        },
      })
      .expect((res) => {
        expect(res.body).not.toHaveProperty('errors');
        expect(res.body).toHaveProperty('data');

        expect(res.body.data).toHaveProperty('deleteUser');
        expect(res.body.data.deleteUser).toHaveProperty('_id', mockUser._id);
        expect(res.body.data.deleteUser).toHaveProperty('uid', mockUser.uid);
        expect(res.body.data.deleteUser).toHaveProperty('name', mockUser.name);
      })
      .end((err) => {
        done(err);
      });
  });

  it('should delete a user group', (done) => {
    const manageSearchSpy = jest
      .spyOn(UserGroupAPIHelper, 'manageSearchIndex')
      .mockReturnValueOnce(Promise.resolve());
    request
      .post('/graphql')
      .send({
        query,
        operationName: 'DeletingGroup',
        variables: {
          id: tempGroupId,
        },
      })
      .expect((res) => {
        expect(res.body).not.toHaveProperty('errors');
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('deleteGroup');
        expect(res.body.data.deleteGroup).toHaveProperty('_id', tempGroupId);
        expect(res.body.data.deleteGroup).toHaveProperty('cn', mockGroup.cn);
        expect(res.body.data.deleteGroup).toHaveProperty(
          'name',
          mockGroup.name
        );
      })
      .end((err) => {
        done(err);
        manageSearchSpy.mockRestore();
      });
  });
});
