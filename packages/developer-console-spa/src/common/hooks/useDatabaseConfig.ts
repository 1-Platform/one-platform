import { useEffect, useState } from 'react';
import { appDatabaseConfig } from 'common/utils/gql-queries';
import gqlClient from 'common/utils/gqlClient';

export default function useDatabaseConfig (projectId: string) {
  const [ databaseConfig, setDatabaseConfig ] = useState<Project.DatabaseConfig>( {} as Project.DatabaseConfig );
  const [ loading, setLoading ] = useState( true );

  useEffect( () => {
    if ( !projectId ) {
      return;
    }
    const abortController = new AbortController();
    const signal = abortController.signal;

    setLoading( true );

    gqlClient( { query: appDatabaseConfig, variables: { projectId } }, signal )
      .then( res => {
        if ( !res?.data ) {
          setLoading( false );
          return;
        }
        setDatabaseConfig( res.data?.project?.database ?? {} );
        setLoading( false );
      } )
      .catch( err => {
        console.debug( err );
        window.OpNotification?.danger( {
          subject: 'There was some error fetching database configuration.',
          body: 'Please try again later.'
        } );
      } );

    return () => abortController.abort();
  }, [ projectId ] );

  return { databaseConfig, setDatabaseConfig, loading };
}
