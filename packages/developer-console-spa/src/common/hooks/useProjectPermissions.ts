import { useEffect, useState } from 'react';
import { projectPermissionsQuery } from 'common/utils/gql-queries';
import gqlClient from 'common/utils/gqlClient';

export default function useProjectPermissions ( projectId: string ) {
  const [ projectPermissions, setProjectPermissions ] = useState<Project.Permission[]>( [] );
  const [ loading, setLoading ] = useState( true );

  useEffect( () => {
    if ( !projectId ) {
      return;
    }
    const abortController = new AbortController();
    const signal = abortController.signal;

    setLoading( true );

    gqlClient( { query: projectPermissionsQuery, variables: { projectId } }, signal )
      .then( res => {
        if ( !res?.data ) {
          setLoading( false );
          return;
        }
        setProjectPermissions( res.data?.project?.permissions ?? [] );
        setLoading( false );
      } )
      .catch( err => {
        console.debug( err );
        window.OpNotification?.danger( {
          subject: 'There was some error fetching permissions.',
          body: 'Please try again later.'
        } );
      } );

    return () => abortController.abort();
  }, [ projectId ] );

  return { projectPermissions, setProjectPermissions, loading };
}
