import { updateApp } from '../utils/gql-queries';
import gqlClient from '../utils/gqlClient';

export const updateFeedbackConfigService = async ( id: string, feedback: any ) => {
  return gqlClient( {
    query: updateApp,
    variables: {
      id,
      app: {
        feedback
      }
    }
  } )
    .then( res => {
      if ( res.errors && !res?.data?.updateApp ) {
        const errMessage = res.erors.map( ( err: any ) => err.message ).join( ', ' );
        throw new Error( errMessage );
      }
      return res.data.updateApp;
    } )
    .catch( err => {
      console.error( err );
      throw err;
    } );
}
