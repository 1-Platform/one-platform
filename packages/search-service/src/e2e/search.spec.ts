import dotenv from 'dotenv';
/* Mock */
import mock from './mock.json';
import path from 'path';

import Search from '../../service';

/* Supertest */
import supertest from 'supertest';

let request: supertest.SuperTest<supertest.Test>;
const query = `
  query Search($query: String, $start: Int, $rows: Int) {
    search(query: $query, start: $start, rows:$rows) {
      responseHeader {
        zkConnected
        status
        QTime
      }
      response {
        numFound
        start
        docs {
          id
          abstract
        }
      }
    }
  }
`;

beforeAll(() => {
  request = supertest.agent(Search);
});
afterAll(done => {
  return Search.close(done);
});

describe('Search microservice API Test', () => {
  it('Get should return a test search response', done => {
    request
      .post('/graphql')
      .send({
        query: query,
        operationName: 'Search',
        variables: {
          "query": "lorem",
          "start": 0,
          "rows": 1
        }

      })
      .expect(res => {
        expect(res.body).not.toHaveProperty('errors');
        expect( res.body ).toHaveProperty( 'data' );
        expect( res.body.data ).toHaveProperty( 'search' );
      })
      .end((err, res) => {
        done(err);
      });
  });
});
