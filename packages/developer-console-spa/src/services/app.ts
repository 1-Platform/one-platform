import { deleteApp, updateApp, updateAppPermissions } from '../utils/gql-queries';
import gqlClient from '../utils/gqlClient';

export const updateAppService = async ( id: string, app: any ) => {
  try {
    const res = await gqlClient( { query: updateApp, variables: { id, app } } );
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

export const updateAppPermissionsService = async ( id: string, permissions: App.Permission[] ) => {
  try {
    const res = await gqlClient( { query: updateAppPermissions, variables: { id, permissions } } );
    if ( res.errors && !res?.data?.updateApp ) {
      const errMessage = res.errors.map( ( err: any ) => err.message ).join( ', ' );
      throw new Error( errMessage );
    }
    return res.data.updateApp;
  } catch ( err ) {
    throw err;
  }
}
