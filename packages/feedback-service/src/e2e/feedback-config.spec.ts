/* Mock */
import supertest from 'supertest';
import Feedback from '../../service';
import mock from './mock';
/* Supertest */

let request: supertest.SuperTest<supertest.Test>;
const query = `
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

describe('Feedback configs API Test', () => {
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
