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

describe('LDAP Microservice API Test', () => {
  it('Get LDAP User Endpoint should return user information', done => {
    console.log(mock.uid);
    request
      .get('/ldap/user/' + mock.uid)
      .expect(res => {
        expect(res).toBe('object');
      })
      .end(done);
  });

  it('Get LDAP Group Endpoint should return which group a user belongs to', done => {
    request
      .get('/ldap/group/' + mock.cn + '/members')
      .expect(res => {
        expect(res.body).toBe('object');
      })
      .end(done);
  });
});


