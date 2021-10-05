import { searchUsers } from 'utils/gql-queries';
import gqlClient from 'utils/gqlClient';

export async function findUsers ( uid: string, signal: AbortSignal ) {
  return gqlClient( {
    query: searchUsers,
    variables: {
      uid
    }
  }, signal )
    .then( res => {
      if ( res.errors && !res?.data?.users ) {
        const errMessage = res.errors.map( ( err: any ) => err.message ).join( ', ' );
        throw new Error( errMessage );
      }
      return res.data.users;
    } ).catch( err => {
      console.error( err );
      throw err;
  })
}
