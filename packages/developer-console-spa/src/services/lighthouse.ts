import gqlClient from '../utils/gqlClient';
import { listLHProjects } from '../utils/gql-queries/list-lh-projects';
import { createLHProject } from '../utils/gql-queries/create-lh-projects';
import { listLHProjectBranches } from '../utils/gql-queries/list-lh-projects-branches';
import { addLHSpaConfig } from '../utils/gql-queries/create-lh-spa-config';
import { deleteLHSPAConfig } from '../utils/gql-queries/delete-lh-spa-config';
import { LHSpaConfigByAppId } from '../utils/gql-queries/lh-spa-config-by-appId';

export const getLHProjects = async () => {
  return gqlClient( {
    query: listLHProjects,
    variables: { limit: 9999 },
  } )
    .then( res => {
      if ( res.errors && !res?.data?.listLHProjects?.rows ) {
        const errMessage = res.errors.map( ( err: any ) => err.message ).join( ', ' );
        throw new Error( errMessage );
      }
      return res.data.listLHProjects.rows;
    } )
    .catch( err => {
      console.error( err );
      throw err;
    } );
};

export const createLightHouseProjects = async ( project: Partial<Lighthouse.Project> ) => {
  return gqlClient( {
    query: createLHProject,
    variables: {
      project: project,
    }
  } )
    .then( res => {
      if ( res.errors && !res?.data?.createLHProject ) {
        const errMessage = res.errors.map( ( err: any ) => err.message ).join( ', ' );
        throw new Error( errMessage );
      }
      return res.data.createLHProject;
    } )
    .catch( err => {
      console.error( err );
      throw err;
    } );
};
export const getLHProjectBranches = async ( projectId: string ) => {
  return gqlClient( {
    query: listLHProjectBranches,
    variables: { projectId },
  } )
    .then( res => {
      if ( res.errors && !res?.data?.listLHProjectBranches?.rows ) {
        const errMessage = res.errors.map( ( err: any ) => err.message ).join( ', ' );
        throw new Error( errMessage );
      }
      return res.data.listLHProjectBranches.rows;
    } )
    .catch( err => {
      console.error( err );
      throw err;
    } );
};
export const createLHSpaConfig = async ( config: Lighthouse.Config ) => {
  return gqlClient( {
    query: addLHSpaConfig,
    variables: {
      lhSpaConfig: config
    },
  } )
    .then( res => {
      if ( res.errors && !res?.data?.createLHSpaConfig ) {
        const errMessage = res.errors.map( ( err: any ) => err.message ).join( ', ' );
        throw new Error( errMessage );
      }
      return res.data.createLHSpaConfig;
    } )
    .catch( err => {
      console.error( err );
      throw err;
    } );
};
export const deleteLHSpaConfig = async ( id: string ) => {
  if ( id === ( null || undefined ) ) {
    throw Error( 'Id can not be null' );
  }
  return gqlClient( {
    query: deleteLHSPAConfig,
    variables: { id },
  } )
    .then( res => {
      if ( res.errors && !res?.data?.deleteLHSpaConfig ) {
        const errMessage = res.errors.map( ( err: any ) => err.message ).join( ', ' );
        throw new Error( errMessage );
      }
      return res.data.deleteLHSpaConfig;
    } )
    .catch( err => {
      console.error( err );
      throw err;
    } );
};

export const getLHSpaConfigByAppId = async ( appId: string, signal: AbortSignal ) => {
  return gqlClient( {
    query: LHSpaConfigByAppId,
    variables: { appId },
  }, signal )
    .then( res => {
      if ( res.errors && !res?.data?.getLHSpaConfigByAppId ) {
        const errMessage = res.errors.map( ( err: any ) => err.message ).join( ', ' );
        throw new Error( errMessage );
      }
      return res.data.getLHSpaConfigByAppId;
    } )
    .catch( err => {
      console.error( err );
      throw err;
    } );
};
