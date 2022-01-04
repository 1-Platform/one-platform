/* Supertest */
import supertest from 'supertest';
import Search from '../../service';
/* Mock */
import mock from './mock';

let request: supertest.SuperTest<supertest.Test>;
const query = `
fragment searchMapType on SearchMapType {
  _id
  appId
  apiConfig {
    mode
    apiUrl
    query
    param
  }
  fields {
    ... on FieldType {
      from
      to
    }
  }
  preferences {
    iconUrl
    urlTemplate
    urlParams
    titleTemplate
    titleParams
  }
  createdBy
  createdOn
  updatedBy
  updatedOn
}

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

  mutation CreateUpdateIndex($input: SearchInput) {
    createUpdateIndex(input: $input) {
      status
    }
  }

  mutation DeleteIndex($input: SearchInput) {
    deleteIndex(input: $input) {
      status
    }
  }

  mutation CreateSearchMap($input:SearchMapInput){
    createSearchMap(input: $input){
      ...searchMapType
    }
  }

  query ListSearchMap {
    listSearchMap{
      ...searchMapType
    }
  }


  query GetSearchMap($_id: String!) {
    getSearchMap(_id: $_id) {
      _id
    }
  }

  mutation UpdateSearchMap($input:SearchMapInput){
    updateSearchMap(input: $input){
      ...searchMapType
    }
  }

  mutation DeleteSearchMap($_id: String!) {
    deleteSearchMap(_id: $_id) {
      _id
    }
  }
`;

beforeAll(() => {
  request = supertest.agent(Search);
});
afterAll((done) => {
  return Search.close(done);
});

describe('Search microservice API Test', () => {
  it('search should return a test search response', (done) => {
    request
      .post('/graphql')
      .send({
        query: query,
        operationName: 'Search',
        variables: {
          query: 'lorem',
          start: 0,
          rows: 1,
        },
      })
      .expect((res) => {
        expect(res.body).not.toHaveProperty('errors');
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('search');
      })
      .end((err, res) => {
        done(err);
      });
  });

  it('createUpdateIndex should create/update the search record in solr index', (done) => {
    request
      .post('/graphql')
      .send({
        query: query,
        operationName: 'CreateUpdateIndex',
        variables: {
          input: mock.searchIndexMock,
        },
      })
      .expect((res) => {
        expect(res.body).not.toHaveProperty('errors');
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('createUpdateIndex');
        expect(res.body.data.createUpdateIndex).toHaveProperty('status');
      })
      .end((err, res) => {
        done(err);
      });
  });

  it('DeleteIndex should delete the search record in solr index', (done) => {
    request
      .post('/graphql')
      .send({
        query: query,
        operationName: 'DeleteIndex',
        variables: {
          input: mock.searchIndexMock,
        },
      })
      .expect((res) => {
        expect(res.body).not.toHaveProperty('errors');
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('deleteIndex');
        expect(res.body.data.deleteIndex).toHaveProperty('status');
      })
      .end((err, res) => {
        done(err);
      });
  });

  it('CreateSearchMap should create the map record in search config', (done) => {
    request
      .post('/graphql')
      .send({
        query: query,
        operationName: 'CreateSearchMap',
        variables: {
          input: mock.searchMapMock,
        },
      })
      .expect((res) => {
        expect(res.body).not.toHaveProperty('errors');
        expect( res.body ).toHaveProperty( 'data' );
        expect(res.body.data).toHaveProperty('createSearchMap');
      })
      .end((err, res) => {
        done(err);
      });
  });

  it('ListSearchMap should list the search config in search config', (done) => {
    request
      .post('/graphql')
      .send({
        query: query,
        operationName: 'ListSearchMap',
        variables: null,
      })
      .expect((res) => {
        expect(res.body).not.toHaveProperty('errors');
        expect(res.body).toHaveProperty('data');
      })
      .end((err, res) => {
        done(err);
      });
  } );

  it('GetSearchMap should list the search config in search config', (done) => {
    request
      .post('/graphql')
      .send({
        query: query,
        operationName: 'GetSearchMap',
        variables: {
          _id: mock.searchMapMock._id
        },
      })
      .expect((res) => {
        expect(res.body).not.toHaveProperty('errors');
        expect( res.body ).toHaveProperty( 'data' );
        expect(res.body.data).toHaveProperty('getSearchMap');
      })
      .end((err, res) => {
        done(err);
      });
  });

  it('UpdateSearchMap should update the map record in search config', (done) => {
    request
      .post('/graphql')
      .send({
        query: query,
        operationName: 'UpdateSearchMap',
        variables: {
          input: mock.searchMapMock,
        },
      })
      .expect((res) => {
        expect(res.body).not.toHaveProperty('errors');
        expect( res.body ).toHaveProperty( 'data' );
        expect(res.body.data).toHaveProperty('updateSearchMap');
      })
      .end((err, res) => {
        done(err);
      });
  });

  it('DeleteSearchMap should delete the map record in search config', (done) => {
    request
      .post('/graphql')
      .send({
        query: query,
        operationName: 'DeleteSearchMap',
        variables: {
          _id: mock.searchMapMock._id,
        },
      })
      .expect((res) => {
        expect(res.body).not.toHaveProperty('errors');
        expect( res.body ).toHaveProperty( 'data' );
        expect( res.body.data ).toHaveProperty( 'deleteSearchMap' );
        expect(res.body.data.deleteSearchMap).toHaveProperty('_id', mock.searchMapMock._id);
      })
      .end((err, res) => {
        done(err);
      });
  });
});
