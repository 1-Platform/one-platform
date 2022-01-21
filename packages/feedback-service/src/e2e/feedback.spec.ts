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
      cn
    }
  }

fragment paginatedFeedbackType on PaginatedFeedbackType {
  count
  data {
    ...feedbackType
  }
}

fragment feedbackConfigType on FeedbackConfigType {
  id
  appId
  feedbackEmail
  id
  projectKey
  sourceApiUrl
  sourceHeaders {
    key
    value
  }
  sourceType
}

query ListFeedbacks {
  listFeedbacks {
    ...paginatedFeedbackType
  }
}

query GetFeedbackById($id: ID!) {
  getFeedbackById(id: $id) {
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

query ListFeedbackConfigs {
  listFeedbackConfigs {
    ...feedbackConfigType
  }
}

mutation CreateFeedbackConfig($payload: FeedbackConfigInput!){
  createFeedbackConfig(payload: $payload) {
    ...feedbackConfigType
  }
}

mutation UpdateFeedbackConfig($id:ID, $payload: FeedbackConfigInput!){
  updateFeedbackConfig(id:$id,payload: $payload) {
    ...feedbackConfigType
  }
}

mutation DeleteFeedbackConfig($id:ID!){
  deleteFeedbackConfig(id:$id) {
    ...feedbackConfigType
  }
}
`;

beforeAll(() => {
  request = supertest.agent(Feedback);
});
afterAll(() => Feedback.close());

describe('Feedback microservice API Test', () => {
  it('CreateFeedbackConfig should create an Feedback Config', (done) => {
    request
      .post('/graphql')
      .send({
        query,
        operationName: 'CreateFeedbackConfig',
        variables: {
          payload: mock.feedbackConfigMock,
        },
      })
      .expect((res) => {
        expect(res.body).not.toHaveProperty('errors');
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('createFeedbackConfig');
        expect(res.body.data.createFeedbackConfig).toHaveProperty('appId', mock.feedbackConfigMock.appId);
      })
      .end((err) => {
        done(err);
      });
  });

  it('ListFeedbackConfigs should return all Feedback Configs', (done) => {
    request
      .post('/graphql')
      .send({
        query,
        operationName: 'ListFeedbackConfigs',
      })
      .expect((res) => {
        expect(res.body).not.toHaveProperty('errors');
        expect(res.body).toHaveProperty('data');
        expect(res.body.data.listFeedbackConfigs[0]).toHaveProperty('appId');
      })
      .end((err) => {
        done(err);
      });
  });

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

  it('UpdateFeedbackConfig should update a Feedback Config', (done) => {
    request
      .post('/graphql')
      .send({
        query,
        operationName: 'UpdateFeedbackConfig',
        variables: {
          id: mock.feedbackConfigMock.id,
          payload: mock.feedbackConfigMock,
        },
      })
      .expect((res) => {
        expect(res.body).not.toHaveProperty('errors');
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('updateFeedbackConfig');
      })
      .end((err) => {
        done(err);
      });
  });
  it('DeleteFeedbackConfig should delete a feedback config', (done) => {
    request
      .post('/graphql')
      .send({
        query,
        operationName: 'DeleteFeedbackConfig',
        variables: {
          id: mock.feedbackConfigMock.id,
        },
      })
      .expect((res) => {
        expect(res.body).not.toHaveProperty('errors');
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('deleteFeedbackConfig');
      })
      .end((err) => {
        done(err);
      });
  });
});
