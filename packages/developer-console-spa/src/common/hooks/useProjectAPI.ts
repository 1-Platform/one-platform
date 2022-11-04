import { useEffect, useState } from 'react';
import { projectByProjectId } from 'common/utils/gql-queries/project-by-projectid';
import gqlClient from 'common/utils/gqlClient';

export default function useProjectAPI ( projectId: string ) {
  const [ project, setProject ] = useState<Project>( {} as Project );
  const [ loading, setLoading ] = useState<boolean>( true );

  useEffect( () => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    setLoading( true );

    gqlClient( { query: projectByProjectId, variables: { projectId } }, signal )
      .then( res => {
        if ( !res?.data?.project ) {
          setLoading( false );
          return;
        }
        setProject( res.data.project );
        setLoading( false );
      } );

    return () => abortController.abort();
  }, [ projectId ] );

  return { project, loading, setProject };
}
