import { useEffect, useState } from 'react';
import { appSearchConfig } from 'common/utils/gql-queries';
import gqlClient from 'common/utils/gqlClient';

export default function useSearchConfig ( appId: string ) {
  const [ searchConfig, setSearchConfig ] = useState<Project.SearchConfig>();
  const [ loading, setLoading ] = useState( true );

  useEffect( () => {
    if ( !appId ) {
      return;
    }
    const abortController = new AbortController();
    const signal = abortController.signal;

    setLoading( true );

    gqlClient( { query: appSearchConfig, variables: { appId } }, signal )
      .then( res => {
        if ( !res || !res.data ) {
          setLoading( false );
          throw res.errors;
        }
        setSearchConfig( res.data.searchConfig?.[0] ?? {} );
        setLoading( false );
      } )
      .catch( err => {
        window.OpNotification?.danger( {
          subject: 'There was some error fetching search configuration.',
          body: 'Please try again later.'
        } );
      } );

    return () => abortController.abort();
  }, [ appId ] );

  return { searchConfig, setSearchConfig, loading };
}
