import supertest from 'supertest';
import Lighthouse from '../../service';
import mock from './mock.json';

let request: supertest.SuperTest<supertest.Test>;
const query = `
  query ListLHProjects {
    listLHProjects {
      count
      rows {
        id
        name
        slug
        token
        updatedAt
        adminToken
        baseBranch
        createdAt
        externalUrl
      }
    }
  }

  query ListLHProjectBranches($projectId: String!, $limit: Int) {
    listLHProjectBranches(projectId: $projectId, limit: $limit) {
      count
      rows {
        branch
      }
    }
  }

  query ListLHLeaderboard($type: LHLeaderBoardCategory!) {
    listLHLeaderboard(type: $type) {
      count
      rows {
        rank
        score {
            accessibility
            performance
            pwa
            bestPractices
            seo
        }
      }
    }
  }

   query GetLHRankingOfAProjectBranch($type: LHLeaderBoardCategory!, $projectId: String!, $branch: String!) {
    getLHRankingOfAProjectBranch(type: $type, projectId: $projectId, branch: $branch){
      rank
      score {
          accessibility
          performance
          pwa
          bestPractices
          seo
      }
    }
  }

  query ListLHSpaConfigs($limit: Int) {
    listLHSpaConfigs(limit: $limit) {
      _id
    }
  }
`;

beforeAll(() => {
  request = supertest.agent(Lighthouse);
});
afterAll(() => Lighthouse.close());

describe('Lighthouse audit manager API Test', () => {
  // Lighthouse Audit Tests
  it('Fetch projects from the lighthouse server', (done) => {
    request
      .post('/graphql')
      .send({
        query,
        operationName: 'ListLHProjects',
        variables: null,
      })
      .expect((res) => {
        expect(res.body).not.toHaveProperty('errors');
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('listLHProjects');
        expect(res.body.data.listLHProjects).toHaveProperty('count');
        expect(res.body.data.listLHProjects).toHaveProperty('rows');
        expect(res.body.data.listLHProjects.rows[0]).toHaveProperty('id');
        expect(res.body.data.listLHProjects.rows[0]).toHaveProperty('name');
        expect(res.body.data.listLHProjects.rows[0]).toHaveProperty('slug');
        expect(res.body.data.listLHProjects.rows[0]).toHaveProperty('token');
        expect(res.body.data.listLHProjects.rows[0]).toHaveProperty('updatedAt');
        expect(res.body.data.listLHProjects.rows[0]).toHaveProperty('adminToken');
        expect(res.body.data.listLHProjects.rows[0]).toHaveProperty('baseBranch');
        expect(res.body.data.listLHProjects.rows[0]).toHaveProperty('createdAt');
        expect(res.body.data.listLHProjects.rows[0]).toHaveProperty('externalUrl');
      })
      .end((err) => {
        done(err);
      });
  });

  it('Fetch branches of a lighthouse project from the lighthouse server', (done) => {
    request
      .post('/graphql')
      .send({
        query,
        operationName: 'ListLHProjectBranches',
        variables: {
          projectId: mock.projectId,
          limit: 1,
        },
      })
      .expect((res) => {
        expect(res.body).not.toHaveProperty('errors');
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('listLHProjectBranches');
        expect(res.body.data.listLHProjectBranches).toHaveProperty('rows');
      })
      .end((err) => {
        done(err);
      });
  });

  it('Pull the leaderboard from the lighthouse server', (done) => {
    request
      .post('/graphql')
      .send({
        query,
        operationName: 'ListLHLeaderboard',
        variables: {
          type: 'ACCESSIBILITY',
        },
      })
      .expect((res) => {
        expect(res.body).not.toHaveProperty('errors');
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('listLHLeaderboard');
        expect(res.body.data.listLHLeaderboard).toHaveProperty('count');
        expect(res.body.data.listLHLeaderboard).toHaveProperty('rows');
        expect(res.body.data.listLHLeaderboard.rows[0]).toHaveProperty('rank');
        expect(res.body.data.listLHLeaderboard.rows[0]).toHaveProperty('score');
      })
      .end((err) => {
        done(err);
      });
  });

  it('Pull the leaderboard rank of a build from the lighthouse server', (done) => {
    request
      .post('/graphql')
      .send({
        query,
        operationName: 'GetLHRankingOfAProjectBranch',
        variables: {
          type: 'ACCESSIBILITY',
          projectId: mock.projectId,
          branch: 'master',
        },
      })
      .expect((res) => {
        expect(res.body).not.toHaveProperty('errors');
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('getLHRankingOfAProjectBranch');
        expect(res.body.data.getLHRankingOfAProjectBranch).toHaveProperty('rank');
        expect(res.body.data.getLHRankingOfAProjectBranch).toHaveProperty('score');
      })
      .end((err) => {
        done(err);
      });
  });

  // Lighthouse SPA Config API Tests
  it('Fetch the registered SPA Configs', (done) => {
    request
      .post('/graphql')
      .send({
        query,
        operationName: 'ListLHSpaConfigs',
        variables: {
          limit: 1,
        },
      })
      .expect((res) => {
        expect(res.body).not.toHaveProperty('errors');
        expect(res.body).toHaveProperty('data');
        expect(res.body.data).toHaveProperty('listLHSpaConfigs');
      })
      .end((err) => {
        done(err);
      });
  });
});
