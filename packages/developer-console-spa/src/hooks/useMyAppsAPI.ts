import { useEffect, useState } from 'react';
import { myApps } from '../utils/gql-queries';
import gqlClient from '../utils/gqlClient';

export default function useMyAppsAPI () {
  const [ apps, setApps ] = useState<any[]>( [] );
  const [ loading, setLoading ] = useState<boolean>( true );

  useEffect( () => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    gqlClient( { query: myApps }, signal )
      .then( res => {
        if ( !res || !res.data ) {
          setLoading( false );
          return;
        }
        setApps( res.data.myApps );
        setLoading( false );
      } );

    return () => abortController.abort();
  }, [] );

  return { apps, loading };
}
