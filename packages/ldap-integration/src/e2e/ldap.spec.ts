import dotenv from 'dotenv';
/* Mock */
import mock from './mock.json';
import supertest from 'supertest';

import server from '../../service';

/* Supertest */

let request: supertest.SuperTest<supertest.Test>;

beforeAll(done => {
  request = supertest(server);
  done();
});

describe('Ldap microservice API Test', () => {
  it('Get should return user information', done => {
    console.log(mock.uid);
    request
      .get('/ldap/user/' + mock.uid)
      .expect(res => {
        expect(res).toBe('object');
      })
      .end(done);
  });

  it('Get should return a users belong to the group', done => {
    request
      .get('/ldap/group/' + mock.cn + '/members')
      .expect(res => {
        expect(res.body).toBe('object');
      })
      .end(done);
  });
});


