import { pick } from 'lodash';
import { deleteApp, updateApp } from '../utils/gql-queries';
import gqlClient from '../utils/gqlClient';

export const updateAppService = async ( updatedApp: any ) => {
  try {
    const app = pick( updatedApp, [ 'name', 'path', 'description' ] );
    const res = await gqlClient( { query: updateApp, variables: { id: updatedApp.id, app } } );
    if ( res.errors && !res?.data?.updateApp ) {
      const errMessage = res.errors.map( ( err: any ) => err.message ).join( ', ' );
      throw new Error( errMessage );
    }
    return res.data.updateApp;
  } catch ( err ) {
    throw err;
  }
}

export const deleteAppService = async ( id: string ) => {
  try {
    const res = await gqlClient( { query: deleteApp, variables: { id } } );
    if ( res.errors && !res?.data?.deletApp ) {
      const errMessage = res.errors.map( ( err: any ) => err.message ).join( ', ' );
      throw new Error( errMessage );
    }
    return res.data.deleteApp;
  } catch ( err ) {
    throw err;
  }
}
