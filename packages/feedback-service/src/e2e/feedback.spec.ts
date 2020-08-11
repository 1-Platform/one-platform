/* Mock */
import mock from './mock.json';
import Feedback from '../../service';

/* Supertest enables us to programmatically send HTTP requests such as GET, POST*/
import supertest from 'supertest';

let request: supertest.SuperTest<supertest.Test>;
const query = `

  fragment feedbackType on FeedbackType{
    _id
    description
    ticketID
    experience
  }
  fragment feedbackWithUserType on FeedbackWithUserType{
    _id
    description
    ticketID
    experience
  }
  query ListFeedback {
    listFeedback {
      ...feedbackWithUserType
    }
  }
  query GetFeedback($id: String!) {
    getFeedback(id: $id) {
      ...feedbackWithUserType
    }
  }

  query GetFeedbackBy($input: FeedbackInput!) {
    getFeedbackBy(input: $input) {
      ...feedbackWithUserType
    }
  }

  mutation AddingFeedback($input: FeedbackInput!) {
    addFeedback(input: $input) {
      ...feedbackType
    }
  }
  mutation UpdateFeedback($input: FeedbackInput!) {
    updateFeedback(input: $input) {
      ...feedbackType
    }
  }
  mutation DeleteFeedback($_id: String!) {
    deleteFeedback(id: $_id) {
      ...feedbackType
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
        operationName: 'AddingFeedback',
        variables: {
          input: mock
        }
      })
      .expect(res => {
        expect(res.body).not.toHaveProperty('errors');
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('addFeedback');
        expect(res.body.data.addFeedback).toHaveProperty('_id', mock._id);
        expect(res.body.data.addFeedback).toHaveProperty('description', mock.description);
        expect(res.body.data.addFeedback).toHaveProperty('ticketID', mock.ticketID);
        expect(res.body.data.addFeedback).toHaveProperty('experience', mock.experience);
        expect(res.body.data.addFeedback).toHaveProperty('experience', mock.experience);
      })
      .end((err, res) => {
        done(err);
      });
  });

  it('listFeedback should return all feedbacks', done => {
    request
      .post('/graphql')
      .send({
        query: query,
        operationName: 'ListFeedback',
      })
      .expect(res => {
        expect(res.body).not.toHaveProperty('errors');
        expect(res.body).toHaveProperty('data');
        expect(res.body.data.listFeedback[0]).toHaveProperty('_id');
        expect(res.body.data.listFeedback[0]).toHaveProperty('description');
        expect(res.body.data.listFeedback[0]).toHaveProperty('ticketID');
        expect(res.body.data.listFeedback[0]).toHaveProperty('experience');
      })
      .end((err, res) => {
        done(err);
      });
  });

  it('getFeedback should return a single matched feedback', done => {
    request
      .post('/graphql')
      .send({
        query: query,
        operationName: 'GetFeedback',
        variables: { _id: mock._id }
      })
      .expect(res => {
        expect(res.body).not.toHaveProperty('errors');
        expect(res.body).toHaveProperty('data');
        expect(res.body.data.getFeedback).toHaveProperty('_id', mock._id);
        expect(res.body.data.getFeedback).toHaveProperty('description', mock.description);
        expect(res.body.data.getFeedback).toHaveProperty('ticketID', mock.ticketID);
        expect(res.body.data.getFeedback).toHaveProperty('experience', mock.experience);
      })
      .end((err, res) => {
        done(err);
      });
  });

  it('getFeedbackBy should return a single matched feedbacks', done => {
    request
      .post('/graphql')
      .send({
        query: query,
        operationName: 'GetFeedbackBy',
        variables: {input: mock}

      })
      .expect(res => {
        expect(res.body).not.toHaveProperty('errors');
        expect(res.body).toHaveProperty('data');
      })
      .end((err, res) => {
        done(err);
      });
  });

  it('updateFeedback should update a feedback', done => {
    request
      .post('/graphql')
      .send({
        query: query,
        operationName: 'UpdateFeedback',
        variables: {
          input: mock
        }
      })
      .expect(res => {
        expect(res.body).not.toHaveProperty('errors');
        expect(res.body).toHaveProperty('data');
        expect(res.body.data.updateFeedback).toHaveProperty('_id', mock._id);
        expect(res.body.data.updateFeedback).toHaveProperty('description', mock.description);
        expect(res.body.data.updateFeedback).toHaveProperty('ticketID', mock.ticketID);
        expect(res.body.data.updateFeedback).toHaveProperty('experience', mock.experience);
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
