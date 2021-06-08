import { useEffect, useState } from 'react';
import { appByAppId } from '../utils/gql-queries/app-by-appid';
import gqlClient from '../utils/gqlClient';

export default function useAppAPI ( appId: string ) {
  const [ app, setApp ] = useState<any>( {} );
  const [ loading, setLoading ] = useState<boolean>( true );

  useEffect( () => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    gqlClient( { query: appByAppId, variables: { appId: '/' + appId } }, signal )
      .then( res => {
        if ( !res || !res.data ) {
          setLoading( false );
          return;
        }
        setApp( res.data.app[ 0 ] );
        setLoading( false );
      } );

    return () => abortController.abort();
  }, [ appId ] );

  return { app, loading };
}
