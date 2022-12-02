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

export const deleteProjectService = async ( projectId: string ) => {
  try {
    const res = await gqlClient( { query: deleteProject, variables: { projectId } } );
    if ( res.errors && !res?.data?.deleteProject ) {
      const errMessage = res.errors.map( ( err: any ) => err.message ).join( ', ' );
      throw new Error( errMessage );
    }
    return res.data.deleteProject;
  } catch ( err ) {
    throw err;
  }
}

export const updateProjectPermissionsService = async ( projectId: string, permissions: Project.Permission[] ) => {
  try {
    const res = await gqlClient( { query: updateProjectPermissions, variables: { projectId, permissions } } );
    if ( res.errors && !res?.data?.updateProject ) {
      const errMessage = res.errors.map( ( err: any ) => err.message ).join( ', ' );
      throw new Error( errMessage );
    }
    return res.data.updateProject;
  } catch ( err ) {
    throw err;
  }
}
