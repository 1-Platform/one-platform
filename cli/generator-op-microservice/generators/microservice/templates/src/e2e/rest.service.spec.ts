import dotenv from 'dotenv';
/* Mock */
import mock from './mock.json';
import path from 'path';
import supertest from 'supertest';

import server from '../../service';

/* Supertest */

let request: supertest.SuperTest<supertest.Test>;

beforeAll(done => {
  request = supertest(server);
  done();
});

describe('<%= serviceClassName %> microservice API Test', () => {
  it('List should return all documents', done => {
    request
      .get('/<%= apiPathName %>')
      .expect(res => {
        expect(res.body).not.toHaveProperty('errors');
        expect(res.body).toEqual(expect.arrayContaining([{'message': 'GET API for <%= serviceClassName %> microservice'}]));
      })
      .end(done);
  });

  it('Get should return a single matched document', done => {
    request
      .get('/<%= apiPathName %>/id/mock_id')
      .expect(res => {
        expect(res.body).not.toHaveProperty('errors');
        expect(res.body.message).toEqual('GET by ID API for <%= serviceClassName %> microservice');
      })
      .end(done);
  });

  it('Create should create a document', done => {
    request
      .post('/<%= apiPathName %>')
      .send(mock)
      .expect(res => {
        expect(res.body).not.toHaveProperty('errors');
        expect(res.body).toHaveProperty('message', mock.message);
      })
      .end(done);
  });

  it('Update should update a document', done => {
    request
      .put('/<%= apiPathName %>/id/mock_id')
      .send(mock)
      .expect(res => {
        expect(res.body).not.toHaveProperty('errors');
        expect(res.body).toHaveProperty('message', mock.message);
      })
      .end(done);
  });

  it('Patch should update a document', done => {
    request
      .patch('/<%= apiPathName %>/id/mock_id')
      .send(mock)
      .expect(res => {
        expect(res.body).not.toHaveProperty('errors');
        expect(res.body).toHaveProperty('message', mock.message);
      })
      .end(done);
  });

  it('Delete should delete a document', done => {
    request
      .delete('/<%= apiPathName %>/id/mock_id')
      .send(mock)
      .expect(res => {
        expect(res.body).not.toHaveProperty('errors');
        expect(res.body).toHaveProperty('message', mock.message);
      })
      .end(done);
  });
});


