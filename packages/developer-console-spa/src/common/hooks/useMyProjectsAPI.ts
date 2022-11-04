import { useEffect, useState } from 'react';
import { myProjects } from 'common/utils/gql-queries';
import gqlClient from 'common/utils/gqlClient';

export default function useMyProjectsAPI () {
  const [ projects, setProjects ] = useState<Project[]>( [] );
  const [ loading, setLoading ] = useState<boolean>( true );

  useEffect( () => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    gqlClient( { query: myProjects }, signal )
      .then( res => {
        if ( !res || !res.data ) {
          setLoading( false );
          return;
        }
        setProjects( res.data.myProjects );
        setLoading( false );
      } );

    return () => abortController.abort();
  }, [] );

  return { projects, loading };
}
