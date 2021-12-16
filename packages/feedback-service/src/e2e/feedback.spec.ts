/* Mock */
import supertest from 'supertest';
import mock from './mock';
import Feedback from '../../service';

/* Supertest */

let request: supertest.SuperTest<supertest.Test>;
const query = `
fragment feedbackType on FeedbackType {
  id
  summary
  experience
  module
  ticketUrl
  state
  assignee {
      name
      email
    }
  createdBy {
      rhatUUID
    }
}
query ListFeedbacks {
  listFeedbacks {
      ...feedbackType
    }
  }

  query GetFeedbackBy($id: ID) {
    getFeedbackBy(id: $id) {
      ...feedbackType
    }
  }

  mutation CreateFeedback($input: FeedbackInput!) {
    createFeedback(input: $input) {
      ...feedbackType
    }
  }

  mutation DeleteFeedback($id: ID!) {
    deleteFeedback(id: $id) {
      ...feedbackType
    }
  }
`;

beforeAll(() => {
  request = supertest.agent(Feedback);
});
afterAll(() => Feedback.close());

describe('Feedback microservice API Test', () => {
  it('createFeedback should create a feedback', (done) => {
    request
      .post('/graphql')
      .send({
        query,
        operationName: 'CreateFeedback',
        variables: {
          input: mock.feedbackMock,
        },
      })
      .expect((res) => {
        expect(res.body).not.toHaveProperty('errors');
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('createFeedback');
        expect(res.body.data.createFeedback).toHaveProperty('id', mock.feedbackMock.id);
      })
      .end((err) => {
        done(err);
      });
  });

  it('List should return all Feedbacks', (done) => {
    request
      .post('/graphql')
      .send({
        query,
        operationName: 'GetFeedbackBy',
      })
      .expect((res) => {
        expect(res.body).not.toHaveProperty('errors');
        expect(res.body).toHaveProperty('data');
        expect(res.body.data.getFeedbackBy[0]).toHaveProperty('id');
        expect(res.body.data.getFeedbackBy[0]).toHaveProperty('summary');
        expect(res.body.data.getFeedbackBy[0]).toHaveProperty('experience');
      })
      .end((err) => {
        done(err);
      });
  });

  it('deleteFeedback should delete a feedback', (done) => {
    request
      .post('/graphql')
      .send({
        query,
        operationName: 'DeleteFeedback',
        variables: { id: mock.feedbackMock.id },
      })
      .expect((res) => {
        expect(res.body).not.toHaveProperty('errors');
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('deleteFeedback');
      })
      .end((err) => {
        done(err);
      });
  });
});
