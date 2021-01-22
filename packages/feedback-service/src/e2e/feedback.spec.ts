import dotenv from 'dotenv';
/* Mock */
import mock from './mock.json';
import path from 'path';

import Feedback from '../../service';

/* Supertest */
import supertest from 'supertest';

let request: supertest.SuperTest<supertest.Test>;
const query = `
  query ListFeedbacks {
    listFeedbacks {
      _id
      summary
      experience
      module
      source
      ticketUrl
      state
      assignee {
        name
        email
      }
      createdBy {
        name
        rhatUUID
      }
    }
  }  

  query ListFeedback($_id: ID) {
    listFeedback(_id: $_id) {
      _id
      summary
      experience
      module
      source
      ticketUrl
      state
      assignee {
        name
        email
      }
      createdBy {
        name
        rhatUUID
      }
    }
  }

  mutation CreateFeedback($input: FeedbackInput!) {
    createFeedback(input: $input) {
      _id
      summary
      experience
      module
      source
      ticketUrl
      state
      assignee {
        name
        email
      }
      createdBy {
        name
        rhatUUID
      }
    }
  }

  mutation DeleteFeedback($_id: ID!) {
    deleteFeedback(_id: $_id) {
      _id
    }
  }
`;

beforeAll(() => {
  request = supertest.agent(Feedback);
});
afterAll(done => {
  return Feedback.close(done);
});

describe('Feedback microservice API Test', () => {
  it('addFeedback should create a feedback', done => {
    request
      .post('/graphql')
      .send({
        query: query,
        operationName: 'CreateFeedback',
        variables: {
          input: mock
        }
      })
      .expect(res => {
        expect(res.body).not.toHaveProperty('errors');
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('createFeedback');
        expect(res.body.data.createFeedback).toHaveProperty('_id', mock._id);
      })
      .end((err, res) => {
        done(err);
      });
  });

  it('List should return all Feedbacks', done => {
    request
      .post('/graphql')
      .send({
        query: query,
        operationName: 'ListFeedbacks'
      })
      .expect(res => {
        expect(res.body).not.toHaveProperty('errors');
        expect(res.body).toHaveProperty('data');
        expect(res.body.data.listFeedbacks[0]).toHaveProperty('_id');
        expect(res.body.data.listFeedbacks[0]).toHaveProperty('summary');
        expect(res.body.data.listFeedbacks[0]).toHaveProperty('experience');
      })
      .end((err, res) => {
        done(err);
      });
  });

  it('deleteFeedback should delete a feedback', done => {
    request
      .post('/graphql')
      .send({
        query: query,
        operationName: 'DeleteFeedback',
        variables: { _id: mock._id}
      })
      .expect(res => {
        expect(res.body).not.toHaveProperty('errors');
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('deleteFeedback');
      })
      .end((err, res) => {
        done(err);
      });
  });
});
