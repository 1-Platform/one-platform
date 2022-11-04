import { deleteProject, updateProject, updateProjectPermissions } from 'common/utils/gql-queries';
import gqlClient from 'common/utils/gqlClient';

export const updateProjectService = async ( projectId: string, project: Partial<Project> ) => {
  try {
    const res = await gqlClient( { query: updateProject, variables: { projectId, project } } );
    if ( res.errors && !res?.data?.updateProject ) {
      const errMessage = res.errors.map( ( err: any ) => err.message ).join( ', ' );
      throw new Error( errMessage );
    }
    return res.data.updateProject;
  } catch ( err ) {
    throw err;
  }
}

export const deleteProjectService = async ( id: string ) => {
  try {
    const res = await gqlClient( { query: deleteProject, variables: { id } } );
    if ( res.errors && !res?.data?.deletProject ) {
      const errMessage = res.errors.map( ( err: any ) => err.message ).join( ', ' );
      throw new Error( errMessage );
    }
    return res.data.deleteProject;
  } catch ( err ) {
    throw err;
  }
}

export const updateProjectPermissionsService = async ( id: string, permissions: Project.Permission[] ) => {
  try {
    const res = await gqlClient( { query: updateProjectPermissions, variables: { id, permissions } } );
    if ( res.errors && !res?.data?.updateProject ) {
      const errMessage = res.errors.map( ( err: any ) => err.message ).join( ', ' );
      throw new Error( errMessage );
    }
    return res.data.updateProject;
  } catch ( err ) {
    throw err;
  }
}
