import dotenv from 'dotenv';
/* Mock */
import mock from './mock.json';
import MoDHandover from '../../service';

/* Supertest */
import supertest from 'supertest';

let request: supertest.SuperTest<supertest.Test>;
const query = `
  fragment handoverType on HandoverType {
    handover_id
    handover_region
    date
    handover_notes
    fts_count
    unassigned_count
    worh_count
    woc_count
    ace_count
    irt_count
    rme_count
    unassigned_ncq_sev_1_2_count
    urgent_severity_1_breaches_count
    manager_id
    manager_first_name
    manager_last_name
    manager_email
    handover_type
    watchlist
    proactive_cases
    sensitive_accounts
  }

  fragment statsCountType on StatsCountType {
    fts_count
    rme_count
    unassigned_count
    worh_count
    irt_count
    woc_count
    unassigned_ncq_count
    time
  }

  query ListAllHandovers {
    listAllHandovers {
      ...handoverType
    }
  }

  query ListAllPlatformCount {
    listAllPlatformCount {
      ...statsCountType
    }
  }

  query ListAllETCount {
    listAllETCount {
      ...statsCountType
    }
  }

  query ListAllAPSCount {
    listAllAPSCount {
      ...statsCountType
    }
  }

  mutation CreateHandover($input: HandoverInput) {
    createHandover(input: $input) {
      ...handoverType
    }
  }

  mutation UpdateHandover($input: HandoverInput) {
    updateHandover(input: $input) {
      ...handoverType
    }
  }

  mutation RemoveHandover($handover_id: Float!) {
    removeHandover(handover_id: $handover_id) {
      ...handoverType
    }
  }
  `;

beforeAll( () => {
  request = supertest.agent( MoDHandover );
} );
afterAll( done => {
  return MoDHandover.close( done );
} );

describe( 'MoD Handovers Microservice API Test', () => {
  it( 'Returns All HandOvers List', ( done ) => {
    request
      .post( '/graphql' )
      .send( {
        query: query,
        operationName: 'ListAllHandovers'
      } )
      .expect( ( res: any ) => {
        expect( res.body ).not.toHaveProperty( 'errors' );
        expect( res.body ).toHaveProperty( 'data' );

        expect( res.body.data ).toHaveProperty( 'listAllHandovers' );
        expect( res.body.data.listAllHandovers[ 0 ] ).toHaveProperty( 'handover_id' );
        expect( res.body.data.listAllHandovers[ 0 ] ).toHaveProperty( 'handover_region' );
        expect( res.body.data.listAllHandovers[ 0 ] ).toHaveProperty( 'date' );
        expect( res.body.data.listAllHandovers[ 0 ] ).toHaveProperty( 'handover_notes' );
        expect( res.body.data.listAllHandovers[ 0 ] ).toHaveProperty( 'fts_count' );
        expect( res.body.data.listAllHandovers[ 0 ] ).toHaveProperty( 'unassigned_count' );
        expect( res.body.data.listAllHandovers[ 0 ] ).toHaveProperty( 'worh_count' );
        expect( res.body.data.listAllHandovers[ 0 ] ).toHaveProperty( 'woc_count' );
        expect( res.body.data.listAllHandovers[ 0 ] ).toHaveProperty( 'ace_count' );
        expect( res.body.data.listAllHandovers[ 0 ] ).toHaveProperty( 'irt_count' );
        expect( res.body.data.listAllHandovers[ 0 ] ).toHaveProperty( 'rme_count' );
        expect( res.body.data.listAllHandovers[ 0 ] ).toHaveProperty( 'unassigned_ncq_sev_1_2_count' );
        expect( res.body.data.listAllHandovers[ 0 ] ).toHaveProperty( 'urgent_severity_1_breaches_count' );
        expect( res.body.data.listAllHandovers[ 0 ] ).toHaveProperty( 'manager_id' );
        expect( res.body.data.listAllHandovers[ 0 ] ).toHaveProperty( 'manager_first_name' );
        expect( res.body.data.listAllHandovers[ 0 ] ).toHaveProperty( 'manager_last_name' );
        expect( res.body.data.listAllHandovers[ 0 ] ).toHaveProperty( 'manager_email' );
        expect( res.body.data.listAllHandovers[ 0 ] ).toHaveProperty( 'handover_type' );
        expect( res.body.data.listAllHandovers[ 0 ] ).toHaveProperty( 'watchlist' );
        expect( res.body.data.listAllHandovers[ 0 ] ).toHaveProperty( 'proactive_cases' );
        expect( res.body.data.listAllHandovers[ 0 ] ).toHaveProperty( 'sensitive_accounts' );
      } )
      .end( ( err, res ) => {
        done( err );
      } );
  } );

  it( 'Returns Platform Count', ( done ) => {
    request
      .post( '/graphql' )
      .send( {
        query: query,
        operationName: 'ListAllPlatformCount'
      } )
      .expect( ( res: any ) => {
        expect( res.body ).not.toHaveProperty( 'errors' );
        expect( res.body ).toHaveProperty( 'data' );

        expect( res.body.data ).toHaveProperty( 'listAllPlatformCount' );
        expect( res.body.data.listAllPlatformCount ).toHaveProperty( 'fts_count' );
        expect( res.body.data.listAllPlatformCount ).toHaveProperty( 'rme_count' );
        expect( res.body.data.listAllPlatformCount ).toHaveProperty( 'unassigned_count' );
        expect( res.body.data.listAllPlatformCount ).toHaveProperty( 'worh_count' );
        expect( res.body.data.listAllPlatformCount ).toHaveProperty( 'irt_count' );
        expect( res.body.data.listAllPlatformCount ).toHaveProperty( 'woc_count' );
        expect( res.body.data.listAllPlatformCount ).toHaveProperty( 'unassigned_ncq_count' );
        expect( res.body.data.listAllPlatformCount ).toHaveProperty( 'time' );
      } )
      .end( ( err, res ) => {
        done( err );
      } );
  } );

  it( 'Returns ET Count', ( done ) => {
    request
      .post( '/graphql' )
      .send( {
        query: query,
        operationName: 'ListAllETCount'
      } )
      .expect( ( res: any ) => {
        expect( res.body ).not.toHaveProperty( 'errors' );
        expect( res.body ).toHaveProperty( 'data' );

        expect( res.body.data ).toHaveProperty( 'listAllETCount' );
        expect( res.body.data.listAllETCount ).toHaveProperty( 'fts_count' );
        expect( res.body.data.listAllETCount ).toHaveProperty( 'rme_count' );
        expect( res.body.data.listAllETCount ).toHaveProperty( 'unassigned_count' );
        expect( res.body.data.listAllETCount ).toHaveProperty( 'worh_count' );
        expect( res.body.data.listAllETCount ).toHaveProperty( 'irt_count' );
        expect( res.body.data.listAllETCount ).toHaveProperty( 'woc_count' );
        expect( res.body.data.listAllETCount ).toHaveProperty( 'unassigned_ncq_count' );
        expect( res.body.data.listAllETCount ).toHaveProperty( 'time' );
      } )
      .end( ( err, res ) => {
        done( err );
      } );
  } );

  it( 'Returns APS Count', ( done ) => {
    request
      .post( '/graphql' )
      .send( {
        query: query,
        operationName: 'ListAllAPSCount'
      } )
      .expect( ( res: any ) => {
        expect( res.body ).not.toHaveProperty( 'errors' );
        expect( res.body ).toHaveProperty( 'data' );
        expect( res.body.data ).toHaveProperty( 'listAllAPSCount' );
        expect( res.body.data.listAllAPSCount ).toHaveProperty( 'fts_count' );
        expect( res.body.data.listAllAPSCount ).toHaveProperty( 'rme_count' );
        expect( res.body.data.listAllAPSCount ).toHaveProperty( 'unassigned_count' );
        expect( res.body.data.listAllAPSCount ).toHaveProperty( 'worh_count' );
        expect( res.body.data.listAllAPSCount ).toHaveProperty( 'irt_count' );
        expect( res.body.data.listAllAPSCount ).toHaveProperty( 'woc_count' );
        expect( res.body.data.listAllAPSCount ).toHaveProperty( 'unassigned_ncq_count' );
        expect( res.body.data.listAllAPSCount ).toHaveProperty( 'time' );
      } )
      .end( ( err, res ) => {
        done( err );
      } );
  } );

  it( 'Creates New HandOver', ( done ) => {
    request
      .post( '/graphql' )
      .send( {
        query: query,
        operationName: 'CreateHandover',
        variables: {
          input: mock
        }
      } )
      .expect( ( res: any ) => {
        expect( res.body ).not.toHaveProperty( 'errors' );
        expect( res.body ).toHaveProperty( 'data' );

        expect( res.body.data ).toHaveProperty( 'createHandover' );
      } )
      .end( ( err, res ) => {
        done( err );
      } );
  } );

  it( 'Updates HandOver', ( done ) => {
    request
      .post( '/graphql' )
      .send( {
        query: query,
        operationName: 'UpdateHandover',
        variables: {
          input: mock
        }
      } )
      .expect( ( res: any ) => {
        expect( res.body ).not.toHaveProperty( 'errors' );
        expect( res.body ).toHaveProperty( 'data' );

        expect( res.body.data ).toHaveProperty( 'updateHandover' );
      } )
      .end( ( err, res ) => {
        done( err );
      } );
  } );

  it( 'Remove HandOver', ( done ) => {
    request
      .post( '/graphql' )
      .send( {
        query: query,
        operationName: 'RemoveHandover',
        variables: {
          handover_id: mock.handover_id
        }
      } )
      .expect( ( res: any ) => {
        expect( res.body ).not.toHaveProperty( 'errors' );
        expect( res.body ).toHaveProperty( 'data' );
        expect( res.body.data ).toHaveProperty( 'removeHandover' );
      } )
      .end( ( err, res ) => {
        done( err );
      } );
  } );
} );
