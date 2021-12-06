// /* Mock */
// import supertest from 'supertest';
// import mock from './mock';
// import Feedback from '../../service';

// /* Supertest */

// let request: supertest.SuperTest<supertest.Test>;
// const query = `
// query ListFeedbacks {
//   listFeedbacks {
//       id
//       summary
//       experience
//       module
//       source
//       ticketUrl
//       state
//       assignee {
//         name
//         email
//       }
//       createdBy {
//         name
//         rhatUUID
//       }
//     }
//   }

//   query ListFeedback($id: ID) {
//     listFeedback(id: $id) {
//       id
//       summary
//       experience
//       module
//       source
//       ticketUrl
//       state
//       assignee {
//         name
//         email
//       }
//       createdBy {
//         name
//         rhatUUID
//       }
//     }
//   }

//   mutation CreateFeedback($input: FeedbackInput!) {
//     createFeedback(input: $input) {
//       id
//       summary
//       experience
//       module
//       source
//       ticketUrl
//       state
//       assignee {
//         name
//         email
//       }
//       createdBy {
//         name
//         rhatUUID
//       }
//     }
//   }

//   mutation DeleteFeedback($id: ID!) {
//     deleteFeedback(id: $id) {
//       id
//     }
//   }
// `;

// beforeAll(() => {
//   request = supertest.agent(Feedback);
// });
// afterAll(() => Feedback.close());

// xdescribe('Feedback microservice API Test', () => {
//   xit('addFeedback should create a feedback', (done) => {
//     request
//       .post('/graphql')
//       .send({
//         query,
//         operationName: 'CreateFeedback',
//         variables: {
//           input: mock,
//         },
//       })
//       .expect((res) => {
//         expect(res.body).not.toHaveProperty('errors');
//         expect(res.body).toHaveProperty('data');
//         expect(res.body.data).toHaveProperty('createFeedback');
//         expect(res.body.data.createFeedback).toHaveProperty('id', mock.id);
//       })
//       .end((err, res) => {
//         done(err);
//       });
//   });

//   it('List should return all Feedbacks', (done) => {
//     request
//       .post('/graphql')
//       .send({
//         query,
//         operationName: 'ListFeedbacks',
//       })
//       .expect((res) => {
//         expect(res.body).not.toHaveProperty('errors');
//         expect(res.body).toHaveProperty('data');
//         expect(res.body.data.listFeedbacks[0]).toHaveProperty('id');
//         expect(res.body.data.listFeedbacks[0]).toHaveProperty('summary');
//         expect(res.body.data.listFeedbacks[0]).toHaveProperty('experience');
//       })
//       .end((err, res) => {
//         done(err);
//       });
//   });

//   it('deleteFeedback should delete a feedback', (done) => {
//     request
//       .post('/graphql')
//       .send({
//         query,
//         operationName: 'DeleteFeedback',
//         variables: { id: mock.id },
//       })
//       .expect((res) => {
//         expect(res.body).not.toHaveProperty('errors');
//         expect(res.body).toHaveProperty('data');
//         expect(res.body.data).toHaveProperty('deleteFeedback');
//       })
//       .end((err, res) => {
//         done(err);
//       });
//   });
// });
