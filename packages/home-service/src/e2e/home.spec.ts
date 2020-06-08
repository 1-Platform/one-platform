/* Mock */
import mock from './mock.json';
import Home from '../../service';
/* Supertest */
import supertest from 'supertest';

let request: supertest.SuperTest<supertest.Test>;
const query = `
  fragment home on HomeType {
    _id
    name
    description
    link
    icon
    entityType
    colorScheme
    videoUrl
    active
    owners {
      _id
    }
  }
  query List {
    listHomeType {
      ...home
    }
  }
  query Get($_id: String!) {
    getHomeType(_id: $_id) {
      ...home
    }
  }
  mutation Create($input: HomeInput) {
    createHomeType(input: $input) {
      ...home
    }
  }
  mutation Update($input: HomeInput) {
    updateHomeType(input: $input) {
      ...home
    }
  }
  mutation Delete($_id: String!) {
    deleteHomeType(_id: $_id) {
      ...home
    }
  }
`;

beforeAll(() => {
  request = supertest.agent(Home);
});
afterAll(done => {
  return Home.close(done);
});

describe('Home microservice API Test', () => {
  it('Create should create a document', done => {
    request
      .post('/graphql')
      .send({
        query: query,
        operationName: 'Create',
        variables: {
          input: mock
        }
      })
      .expect(res => {
        expect(res.body).not.toHaveProperty('errors');
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('createHomeType');
        expect(res.body.data.createHomeType).toHaveProperty('_id', mock._id);
        expect(res.body.data.createHomeType).toHaveProperty('name', mock.name);
        expect(res.body.data.createHomeType).toHaveProperty('description', mock.description);
        expect(res.body.data.createHomeType).toHaveProperty('entityType', mock.entityType);
        expect(res.body.data.createHomeType).toHaveProperty('active', mock.active);
      })
      .end((err, res) => {
        done(err);
      });
  });

  it('List should return all documents', done => {
    request
      .post('/graphql')
      .send({
        query: query,
        operationName: 'List'
      })
      .expect(res => {
        expect(res.body).not.toHaveProperty('errors');
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('listHomeType');
        expect(res.body.data.listHomeType).not.toHaveLength(0);
        expect(res.body.data.listHomeType[0]).toHaveProperty('_id');
        expect(res.body.data.listHomeType[0]).toHaveProperty('description');
        expect(res.body.data.listHomeType[0]).toHaveProperty('name');
        expect(res.body.data.listHomeType[0]).toHaveProperty('entityType');
        expect(res.body.data.listHomeType[0]).toHaveProperty('active', mock.active);
      })
      .end((err, res) => {
        done(err);
      });
  });

  it('Get should return a single matched document', done => {
    request
      .post('/graphql')
      .send({
        query: query,
        operationName: 'Get',
        variables: { _id: mock._id }

      })
      .expect(res => {
        expect(res.body).not.toHaveProperty('errors');
        expect(res.body).toHaveProperty('data');
        expect(res.body.data.getHomeType[0]).toHaveProperty('_id', mock._id);
        expect(res.body.data.getHomeType[0]).toHaveProperty('description', mock.description);
        expect(res.body.data.getHomeType[0]).toHaveProperty('name', mock.name);
        expect(res.body.data.getHomeType[0]).toHaveProperty('entityType', mock.entityType);
        expect(res.body.data.getHomeType[0]).toHaveProperty('active', mock.active);

      })
      .end((err, res) => {
        done(err);
      });
  });

  it('Update should update a document', done => {
    request
      .post('/graphql')
      .send({
        query: query,
        operationName: 'Update',
        variables: {
          input: mock
        }
      })
      .expect(res => {
        expect(res.body).not.toHaveProperty('errors');
        expect(res.body).toHaveProperty('data');
        expect(res.body.data.updateHomeType).toHaveProperty('_id', mock._id);
        expect(res.body.data.updateHomeType).toHaveProperty('description', mock.description);
        expect(res.body.data.updateHomeType).toHaveProperty('entityType', mock.entityType);
        expect(res.body.data.updateHomeType).toHaveProperty('name', mock.name);
        expect(res.body.data.updateHomeType).toHaveProperty('active', mock.active);
      })
      .end((err, res) => {
        done(err);
      });
  });

  it('Delete should delete a document', done => {
    request
      .post('/graphql')
      .send({
        query: query,
        operationName: 'Delete',
        variables: { _id: mock._id }
      })
      .expect(res => {
        expect(res.body).not.toHaveProperty('errors');
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('deleteHomeType');
      })
      .end((err, res) => {
        done(err);
      });
  });
});


